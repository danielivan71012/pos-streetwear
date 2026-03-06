const fs = require('fs');
const results = [];
const filesToDelete = [
  'postman/collections/POS Streetwear API/POST Crear Vendedor.request.yaml',
  'postman/collections/POS Streetwear API/POST Crear Vendedor v2.request.yaml'
];
for (const file of filesToDelete) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      results.push('DELETED: ' + file);
    } else {
      results.push('NOT FOUND: ' + file);
    }
  } catch (err) {
    results.push('ERROR: ' + file + ' - ' + err.message);
  }
}
fs.writeFileSync('_delete_results.txt', results.join('\n'), 'utf8');
