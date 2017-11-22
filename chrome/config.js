'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'chrome',
};

app.locale = {
  name: 'Google Chrome',
  current: 'Open Link in Google Chrome',
  all: 'Open all Tabs in Google Chrome',
  call: 'Open all Tabs in Google Chrome (Current window)',
  example: 'example D:\\Google\\Application\\chrome.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'Google Chrome']
  },
  linux: {
    name: 'google-chrome'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'chrome "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe'
  }
};
