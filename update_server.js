const fs = require('fs');
let js = fs.readFileSync('server.js', 'utf8');
js = js.replace(/'public\//g, "'client/public/");
js = js.replace(/__dirname, 'public'/g, "__dirname, 'client/public'");
fs.writeFileSync('server.js', js);
console.log('Updated server.js');
