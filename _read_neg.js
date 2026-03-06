const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'postman', 'collections', 'POS Streetwear API', 'Negative Tests');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.yaml'));
files.forEach(f => {
  console.log('=== ' + f + ' ===');
  console.log(fs.readFileSync(path.join(dir, f), 'utf8'));
  console.log('');
});
