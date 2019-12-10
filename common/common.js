/* globals app */
'use strict';

const os = {
  mac: navigator.userAgent.indexOf('Mac') !== -1,
  linux: navigator.userAgent.indexOf('Linux') !== -1
};
const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

function error(response) {
  window.alert(`Something went wrong!

-----
Code: ${response.code}
Output: ${response.stdout}
Error: ${response.stderr}`);
}

function response(res, success = () => {}) {
  // windows batch file returns 1
  if (res && (res.code !== 0 && (res.code !== 1 || res.stderr !== ''))) {
    error(res);
  }
  else if (!res) {
    chrome.tabs.query({
      url: chrome.runtime.getURL('data/helper/index.html')
    }, tabs => {
      if (tabs && tabs.length) {
        chrome.tabs.update(tabs[0].id, {
          active: true
        }, () => {
          chrome.windows.update(tabs[0].windowId, {
            focused: true
          });
        });
      }
      else {
        chrome.tabs.create({
          url: 'data/helper/index.html'
        });
      }
    });
  }
  else {
    success();
  }
}

function exec(command, args, callback, properties = {}) {
  if (command) {
    chrome.runtime.sendNativeMessage(app.id, {
      cmd: 'exec',
      command,
      arguments: args,
      properties
    }, res => (callback || response)(res));
  }
  else {
    window.alert(`Please set the "${app.locale.name}" executable path in the options page`);
    chrome.runtime.openOptionsPage();
  }
}

function find(callback) {
  chrome.runtime.sendNativeMessage(app.id, {
    cmd: 'env'
  }, res => {
    if (res && res.env && res.env.ProgramFiles) {
      chrome.storage.local.set({
        path: app.runtime.windows.prgfiles
          .replace('%LOCALAPPDATA%', res.env.LOCALAPPDATA)
          .replace('%ProgramFiles(x86)%', res.env['ProgramFiles(x86)'])
          .replace('%ProgramFiles%', res.env.ProgramFiles)
      }, callback);
    }
    else {
      response(res);
    }
  });
}


const open = (urls, closeIDs = []) => {
  chrome.storage.local.get({
    path: null,
    closeme: false
  }, prefs => {
    const close = () => {
      if (prefs.closeme && closeIDs.length) {
        chrome.tabs.remove(closeIDs);
      }
    };
    if (os.mac) {
      if (prefs.path) {
        const length = app.runtime.mac.args.length;
        app.runtime.mac.args[length - 1] = prefs.path;
      }
      exec('open', [...app.runtime.mac.args, ...urls], r => response(r, close));
    }
    else if (os.linux) {
      exec(prefs.path || app.runtime.linux.name, urls, r => response(r, close));
    }
    else {
      if (prefs.path) {
        exec(prefs.path, [...(app.runtime.windows.args2 || []), ...urls], r => response(r, close));
      }
      else {
        const args = app.runtime.windows.args
          .map(a => a.replace('%url;', urls.join(' ')))
          // Firefox is not detaching the process on Windows
          .map(s => s.replace('start', isFirefox ? 'start /WAIT' : 'start'));
        exec(app.runtime.windows.name, args, res => {
          // use old method
          if (res && res.code !== 0) {
            find(() => open(urls, closeIDs));
          }
          else {
            response(res, close);
          }
        }, {windowsVerbatimArguments: true});
      }
    }
  });
};

function delayOpen(tabs) {
  chrome.storage.local.get({
    multiple: app.multiple
  }, prefs => {
    if (prefs.multiple) {
      return open(tabs.map(t => t.url), tabs.map(t => t.id));
    }
    const tab = tabs.shift();
    if (tab) {
      open([tab.url], [tab.id]);
      window.setTimeout(delayOpen, 1000, tabs);
    }
  });
}

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => open(tabs.map(t => t.url), tabs.map(t => t.id)));
});
// context menu
{
  const callback = () => {
    chrome.contextMenus.create({
      id: 'open-current',
      title: app.locale.current,
      contexts: ['link'],
      documentUrlPatterns: ['*://*/*']
    });
    chrome.contextMenus.create({
      id: 'open-all',
      title: app.locale.all,
      contexts: ['browser_action']
    });
    chrome.contextMenus.create({
      id: 'open-call',
      title: app.locale.call,
      contexts: ['browser_action']
    });
  };
  chrome.runtime.onInstalled.addListener(callback);
  chrome.runtime.onStartup.addListener(callback);
}

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'open-current') {
    open([info.linkUrl || info.pageUrl], []);
  }
  else if (info.menuItemId === 'open-all') {
    chrome.tabs.query({
      url: ['*://*/*']
    }, delayOpen);
  }
  else if (info.menuItemId === 'open-call') {
    chrome.tabs.query({
      url: ['*://*/*'],
      currentWindow: true
    }, delayOpen);
  }
});
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.cmd === 'open-in') {
    open([request.url], [sender.tab.id]);
  }
});

// FAQs & Feedback
{
  const {onInstalled, setUninstallURL, getManifest} = chrome.runtime;
  const {name, version} = getManifest();
  const page = getManifest().homepage_url;
  onInstalled.addListener(({reason, previousVersion}) => {
    const prefs = {'faqs': true};
    chrome.storage.managed.get(prefs, ps => {
      chrome.storage.local.get(Object.assign(chrome.runtime.lastError ? prefs : ps || prefs, {
        'last-update': 0
      }), prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            chrome.tabs.create({
              url: page + '&version=' + version +
                (previousVersion ? '&p=' + previousVersion : '') +
                '&type=' + reason,
              active: reason === 'install'
            });
            chrome.storage.local.set({'last-update': Date.now()});
          }
        }
      });
    });
  });
  setUninstallURL(page + '&rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
}
