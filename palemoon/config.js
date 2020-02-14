'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'palemoon',
  multiple: true
};

app.locale = {
  name: 'Pale Moon',
  current: 'Open Link in Pale Moon Browser',
  all: 'Open all Tabs in Pale Moon Browser',
  call: 'Open all Tabs in Pale Moon Browser (Current window)',
  example: 'example D:\\Pale Moon\\browser.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'Palemoon']
  },
  linux: {
    name: 'palemoon'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'palemoon "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Pale Moon\\palemoon.exe'
  }
};
