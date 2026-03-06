const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, results);
    } else {
      results.push(full.replace(/\\/g, '/'));
    }
  }
  return results;
}

const files = walk('postman/collections/POS Streetwear API');
fs.writeFileSync('_file_list.txt', files.join('\n'));
