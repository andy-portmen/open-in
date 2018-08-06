/* globals app */
'use strict';

var os = {
  mac: navigator.userAgent.indexOf('Mac') !== -1,
  linux: navigator.userAgent.indexOf('Linux') !== -1
};
var isFirefox = navigator.userAgent.indexOf('Firefox') === -1;

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
          active: true,
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
  chrome.runtime.sendNativeMessage(app.id, {
    cmd: 'exec',
    command,
    arguments: args,
    properties
  }, res => (callback || response)(res));
}

function find(callback) {
  chrome.runtime.sendNativeMessage(app.id, {
    cmd: 'env'
  }, res => {
    if (res && res.env && res.env.ProgramFiles) {
      chrome.storage.local.set({
        path: app.runtime.windows.prgfiles
          .replace('(x86)', window.navigator.platform === 'Win32' ? '' : '(x86)')
          .replace('%LOCALAPPDATA%', res.env.LOCALAPPDATA)
          .replace('%ProgramFiles%', res.env.ProgramFiles)
          .replace('%ProgramFiles(x86)%', res.env['ProgramFiles(x86)'])
      }, callback);
    }
    else {
      response(res);
    }
  });
}

function open(tab, noclose = false) {
  chrome.storage.local.get({
    path: null,
    closeme: false
  }, prefs => {
    console.log(tab.url, prefs.closeme, noclose);
    function close() {
      if (prefs.closeme && noclose === false) {
        chrome.tabs.remove(tab.id);
      }
    }

    if (os.mac) {
      if (prefs.path) {
        const length = app.runtime.mac.args.length;
        app.runtime.mac.args[length - 1] = prefs.path;
      }
      exec('open', [...app.runtime.mac.args, tab.url], r => response(r, close));
    }
    else if (os.linux) {
      exec(prefs.path || app.runtime.linux.name, [tab.url], r => response(r, close));
    }
    else {
      if (prefs.path) {
        exec(prefs.path, [...(app.runtime.windows.args2 || []), tab.url], r => response(r, close));
      }
      else {
        const args = app.runtime.windows.args
          .map(a => a.replace('%url;', tab.url))
          // Firefox is not detaching the process on Windows
          .map(s => s.replace('start ', isFirefox ? '' : 'start /WAIT '));
        exec(app.runtime.windows.name, args, res => {
          // use old method
          if (res && res.code !== 0) {
            find(() => open(tab.url));
          }
          else {
            response(res, close);
          }
        }, {windowsVerbatimArguments: true});
      }
    }
  });
}
function delayOpen(tabs) {
  const tab = tabs.shift();
  if (tab) {
    open(tab);
    window.setTimeout(delayOpen, 1000, tabs);
  }
}

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => open(tabs[0]));
});

(function(callback) {
  chrome.runtime.onInstalled.addListener(callback);
  chrome.runtime.onStartup.addListener(callback);
})(function() {
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
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-current') {
    open({
      url: info.linkUrl || info.pageUrl,
      id: tab.id
    }, true);
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
    open({
      url: request.url,
      id: sender.tab.id
    }, true);
  }
});

// FAQs & Feedback
chrome.storage.local.get({
  'version': null,
  'faqs': true,
  'last-update': 0
}, prefs => {
  const version = chrome.runtime.getManifest().version;

  if (prefs.version ? (prefs.faqs && prefs.version !== version) : true) {
    const now = Date.now();
    const doUpdate = (now - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
    chrome.storage.local.set({
      version,
      'last-update': doUpdate ? Date.now() : prefs['last-update']
    }, () => {
      // do not display the FAQs page if last-update occurred less than 45 days ago.
      if (doUpdate) {
        const p = Boolean(prefs.version);
        chrome.tabs.create({
          url: chrome.runtime.getManifest().homepage_url + '&version=' + version +
            '&type=' + (p ? ('upgrade&p=' + prefs.version) : 'install'),
          active: p === false
        });
      }
    });
  }
});

{
  const {name, version} = chrome.runtime.getManifest();
  chrome.runtime.setUninstallURL(
    chrome.runtime.getManifest().homepage_url + '&rd=feedback&name=' + name + '&version=' + version
  );
}
