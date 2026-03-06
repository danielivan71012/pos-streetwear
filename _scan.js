const fs = require('fs');
const path = require('path');

function listDir(dir, prefix = '') {
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        console.log(prefix + '[DIR] ' + item);
        listDir(full, prefix + '  ');
      } else {
        console.log(prefix + item);
      }
    });
  } catch(e) {
    console.log(prefix + 'ERROR: ' + e.message);
  }
}

const base = path.join(__dirname, 'postman', 'collections', 'POS Streetwear API');
console.log('=== FULL TREE ===');
listDir(base);
