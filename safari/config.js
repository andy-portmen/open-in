'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'safari',
};

app.locale = {
  name: 'Safari',
  current: 'Open Link in Safari Browser',
  all: 'Open all Tabs in Safari Browser',
  call: 'Open all Tabs in Safari Browser (Current window)',
  example: 'example D:\\Safari\\Safari.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'safari']
  },
  linux: {
    name: 'safari'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'safari "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Safari\\Safari.exe'
  }
};
