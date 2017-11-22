'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'vivaldi',
};

app.locale = {
  name: 'Vivaldi',
  current: 'Open Link in Vivaldi Browser',
  all: 'Open all Tabs in Vivaldi Browser',
  call: 'Open all Tabs in Vivaldi Browser (Current window)',
  example: 'example D:\\Vivaldi\\vivaldi.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'vivaldi']
  },
  linux: {
    name: 'vivaldi'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'vivaldi "%url;"'],
    prgfiles: '%LOCALAPPDATA%\\Vivaldi\\Application\\vivaldi.exe'
  }
};
