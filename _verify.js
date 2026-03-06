const fs = require('fs');
const path = require('path');

const base = 'postman/collections/POS Streetwear API';

function listDir(dir, indent = '') {
  const items = fs.readdirSync(dir).sort();
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      console.log(indent + '[DIR] ' + item);
      listDir(full, indent + '  ');
    } else {
      console.log(indent + item);
    }
  }
}

console.log('=== Collection Structure ===');
listDir(base);
