'use strict';

var app = {
  id: 'com.add0n.node',
  tag: 'waterfox',
  multiple: true
};

app.locale = {
  name: 'Waterfox',
  current: 'Open Link in Waterfox Browser',
  all: 'Open all Tabs in Waterfox Browser',
  call: 'Open all Tabs in Waterfox Browser (Current window)',
  example: 'example D:\\Waterfox\\browser.exe'
};

app.runtime = {
  mac: {
    args: ['-a', 'Waterfox']
  },
  linux: {
    name: 'waterfox'
  },
  windows: {
    name: 'cmd',
    args: ['/s/c', 'start', 'waterfox "%url;"'],
    prgfiles: '%ProgramFiles(x86)%\\Waterfox\\waterfox.exe'
  }
};
