const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname, 'postman', 'collections', 'POS Streetwear API');
const results = [];

// Delete old root-level files
const filesToDelete = [
  path.join(base, 'POST Crear Vendedor.request.yaml'),
  path.join(base, 'POST Crear Vendedor v2.request.yaml'),
  path.join(base, '.info.yaml'),
  path.join(base, 'GET DB Test.request.yaml'),
  path.join(base, 'Health.request.yaml')
];

filesToDelete.forEach(fp => {
  try {
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      results.push('DELETED: ' + path.basename(fp));
    } else {
      results.push('ALREADY GONE: ' + path.basename(fp));
    }
  } catch(e) {
    results.push('ERROR deleting ' + path.basename(fp) + ': ' + e.message);
  }
});

// List what remains
try {
  const items = fs.readdirSync(base);
  results.push('REMAINING: ' + JSON.stringify(items));
} catch(e) {
  results.push('ERROR listing: ' + e.message);
}

fs.writeFileSync(path.resolve(__dirname, '_result.txt'), results.join('\n'), 'utf8');
process.exit(0);
