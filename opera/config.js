'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'opera',
};

app.locale = {
  name: 'Opera',
  current: 'Open Link in Opera Browser',
  all: 'Open all Tabs in Opera Browser',
  call: 'Open all Tabs in Opera Browser (Current window)',
  example: 'example D:\\Opera\\launcher.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'opera']
  },
  linux: {
    name: 'opera'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'opera "%url;"'],
    prgfiles: '%ProgramFiles%\\Opera\\launcher.exe'
  }
};
