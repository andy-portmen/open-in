'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'firefox',
};

app.locale = {
  name: 'Firefox',
  current: 'Open Link in Firefox Browser',
  all: 'Open all Tabs in Firefox Browser',
  call: 'Open all Tabs in Firefox Browser (Current window)',
  example: 'example D:\\Firefox\\firefox.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'firefox']
  },
  linux: {
    name: 'firefox'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'firefox "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Mozilla Firefox\\firefox.exe'
  }
};
