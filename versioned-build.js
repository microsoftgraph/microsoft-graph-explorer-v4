const fs = require('fs');
const thisApp = require('./package');

const dataToAppend = '' +
  `
!function() { return window['appVersion'] = '${thisApp.version}' }()
    `;

fs.appendFileSync('build/static/js/graph-explorer-v2.js', dataToAppend);
