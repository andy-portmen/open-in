'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'edge',
};

app.locale = {
  name: 'Microsoft Edge',
  current: 'Open Link in Microsoft Edge',
  all: 'Open all Tabs in Microsoft Edge',
  call: 'Open all Tabs in Microsoft Edge (Current window)',
  example: 'example D:\\Microsoft\\edge.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'microsoft-edge']
  },
  linux: {
    name: 'microsoft-edge'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'microsoft-edge:"%url;"'],
    prgfiles: '%ProgramFiles%\\Microsoft\\edge.exe'
  }
};
