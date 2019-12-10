'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'chromium',
  multiple: true
};

app.locale = {
  name: 'Chromium',
  current: 'Open Link in Chromium browser',
  all: 'Open all Tabs in Chromium browser',
  call: 'Open all Tabs in Chromium browser (Current window)',
  example: 'example D:\\Google\\Application\\chrome.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'Chromium']
  },
  linux: {
    name: 'chromium'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'chromium "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Chromium\\chrome.exe'
  }
};
