'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'ie',
};

app.locale = {
  name: 'Internet Explorer',
  current: 'Open Link in Internet Explorer',
  all: 'Open all Tabs in Internet Explorer',
  call: 'Open all Tabs in Internet Explorer (Current window)',
  example: 'example D:\\Internet Explorer\\iexplore.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'explorer']
  },
  linux: {
    name: 'explorer'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'iexplore "%url;"'],
    prgfiles: '%ProgramFiles%\\Internet Explorer\\iexplore.exe'
  }
};
