/* globals app */
'use strict';

document.title = 'Open In ' + app.locale.name + ' :: Options';
document.getElementById('path').placeholder = app.locale.example;
document.getElementById('l2').textContent = app.runtime.windows.prgfiles;
document.getElementById('l3').textContent = app.runtime.linux.name;
document.getElementById('l4').textContent = app.runtime.mac.args[1];

function restore() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    path: '',
    enabled: false,
    altKey: true,
    shiftKey: true,
    ctrlKey: false,
    metaKey: false,
    button: 0,
    faqs: true,
    closeme: false,
    multiple: app.multiple,
    hosts: [],
    urls: [],
    reverse: false,
    topRedict: false
  }, prefs => {
    document.getElementById('path').value = prefs.path;
    document.getElementById('enabled').checked = prefs.enabled;
    document.getElementById('altKey').checked = prefs.altKey;
    document.getElementById('shiftKey').checked = prefs.shiftKey;
    document.getElementById('ctrlKey').checked = prefs.ctrlKey;
    document.getElementById('metaKey').checked = prefs.metaKey;
    document.getElementById('button').selectedIndex = prefs.button;
    document.getElementById('faqs').checked = prefs.faqs;
    document.getElementById('closeme').checked = prefs.closeme;
    document.getElementById('multiple').checked = prefs.multiple;
    document.getElementById('hosts').value = prefs.hosts.join(', ');
    document.getElementById('urls').value = prefs.urls.join(', ');
    document.getElementById('reverse').checked = prefs.reverse;
    document.getElementById('topRedict').checked = prefs.topRedict;
  });
}

function save() {
  const path = document.getElementById('path').value;
  const enabled = document.getElementById('enabled').checked;
  const altKey = document.getElementById('altKey').checked;
  const shiftKey = document.getElementById('shiftKey').checked;
  const ctrlKey = document.getElementById('ctrlKey').checked;
  const metaKey = document.getElementById('metaKey').checked;
  const button = document.getElementById('button').selectedIndex;
  const faqs = document.getElementById('faqs').checked;
  const closeme = document.getElementById('closeme').checked;
  const multiple = document.getElementById('multiple').checked;
  const hosts = document.getElementById('hosts').value;
  const urls = document.getElementById('urls').value;
  const reverse = document.getElementById('reverse').checked;
  const topRedict = document.getElementById('topRedict').checked;

  chrome.storage.local.set({
    path,
    enabled,
    altKey,
    shiftKey,
    ctrlKey,
    metaKey,
    button,
    faqs,
    closeme,
    multiple,
    hosts: hosts.split(/\s*,\s*/).map(s => s.replace('http://', '')
      .replace('https://', '')
      .split('/')[0].trim())
      .filter((h, i, l) => h && l.indexOf(h) === i),
    urls: urls.split(/\s*,\s*/).filter(s => s.startsWith('http') || s.startsWith('file'))
      .filter((h, i, l) => h && l.indexOf(h) === i),
    reverse,
    topRedict
  }, () => {
    restore();
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 750);
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '&rd=donate'
}));

document.getElementById('save').addEventListener('click', save);
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    const status = document.getElementById('status');
    window.setTimeout(() => status.textContent = '', 750);
    status.textContent = 'Double-click to reset!';
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
