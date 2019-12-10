'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'brave',
  multiple: true
};

app.locale = {
  name: 'brave',
  current: 'Open Link in Brave Browser',
  all: 'Open all Tabs in Brave Browser',
  call: 'Open all Tabs in Brave Browser (Current window)',
  example: 'example D:\\Brave\\Application\\Brave.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'Brave Browser']
  },
  linux: {
    name: 'brave-browser'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'brave "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
  }
};
