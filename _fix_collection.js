const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'postman', 'collections', 'POS Streetwear API');

// 1. Delete old root-level duplicates
const toDelete = [
  'POST Crear Vendedor.request.yaml',
  'POST Crear Vendedor v2.request.yaml'
];
toDelete.forEach(f => {
  const fp = path.join(base, f);
  if (fs.existsSync(fp)) {
    fs.unlinkSync(fp);
    console.log('DELETED:', f);
  } else {
    console.log('NOT FOUND (skip):', f);
  }
});

// 2. Fix orders in Vendedores/ (GET por ID: 3->3000, PUT: 4->4000, DELETE: 5->5000)
const vendedoresOrderFixes = {
  'GET Vendedor por ID.request.yaml': { from: 'order: 3', to: 'order: 3000' },
  'PUT Actualizar Vendedor.request.yaml': { from: 'order: 4', to: 'order: 4000' },
  'DELETE Eliminar Vendedor.request.yaml': { from: 'order: 5', to: 'order: 5000' },
};
Object.entries(vendedoresOrderFixes).forEach(([file, fix]) => {
  const fp = path.join(base, 'Vendedores', file);
  let content = fs.readFileSync(fp, 'utf8');
  if (content.includes(fix.from)) {
    content = content.replace(fix.from, fix.to);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('FIXED order:', file, fix.from, '->', fix.to);
  } else {
    console.log('ORDER already OK or different:', file);
  }
});

// 3. Fix orders in Productos/ (all have 1-5, need 1000-5000)
const productosOrderFixes = {
  'GET Listar Productos.request.yaml': { from: 'order: 1', to: 'order: 1000' },
  'POST Crear Producto.request.yaml': { from: 'order: 2', to: 'order: 2000' },
  'GET Producto por ID.request.yaml': { from: 'order: 3', to: 'order: 3000' },
  'PUT Actualizar Producto.request.yaml': { from: 'order: 4', to: 'order: 4000' },
  'DELETE Eliminar Producto.request.yaml': { from: 'order: 5', to: 'order: 5000' },
};
Object.entries(productosOrderFixes).forEach(([file, fix]) => {
  const fp = path.join(base, 'Productos', file);
  let content = fs.readFileSync(fp, 'utf8');
  // Use regex to match exact "order: N\n" to avoid partial matches
  const regex = new RegExp('^' + fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'm');
  if (regex.test(content)) {
    content = content.replace(regex, fix.to);
    fs.writeFileSync(fp, content, 'utf8');
    console.log('FIXED order:', file, fix.from, '->', fix.to);
  } else {
    console.log('ORDER already OK or different:', file, '(looking for:', fix.from, ')');
  }
});

// 4. Fix PUT Actualizar Producto - add ID_Marca: 1 to body
const putProductoPath = path.join(base, 'Productos', 'PUT Actualizar Producto.request.yaml');
let putContent = fs.readFileSync(putProductoPath, 'utf8');
// Current body is missing ID_Marca, let's add it
if (!putContent.includes('"ID_Marca"')) {
  putContent = putContent.replace(
    '      "Nombre_Modelo": "Sneaker Actualizado",',
    '      "ID_Marca": 1,\n      "Nombre_Modelo": "Sneaker Actualizado",'
  );
  fs.writeFileSync(putProductoPath, putContent, 'utf8');
  console.log('FIXED: Added ID_Marca to PUT Actualizar Producto body');
} else {
  console.log('PUT Actualizar Producto already has ID_Marca');
}

console.log('\nAll fixes applied!');
