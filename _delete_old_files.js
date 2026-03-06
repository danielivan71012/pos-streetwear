const fs = require('fs');
const path = require('path');

const files = [
  'postman/collections/POS Streetwear API/POST Crear Vendedor.request.yaml',
  'postman/collections/POS Streetwear API/POST Crear Vendedor v2.request.yaml'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('DELETED: ' + f);
    } else {
      console.log('NOT FOUND: ' + f);
    }
  } catch (e) {
    console.log('ERROR: ' + f + ' - ' + e.message);
  }
});
