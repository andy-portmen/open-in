'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'yandex',
};

app.locale = {
  name: 'Firefox',
  current: 'Open Link in Yandex Browser',
  all: 'Open all Tabs in Yandex Browser',
  call: 'Open all Tabs in Yandex Browser (Current window)',
  example: 'example D:\\Yandex\\browser.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'yandex']
  },
  linux: {
    name: 'yandex'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'yandex "%url;"'],
    prgfiles: '%LOCALAPPDATA%\\Yandex\\YandexBrowser\\Application\\browser.exe'
  }
};
