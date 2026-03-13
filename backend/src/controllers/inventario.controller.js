const db = require("../db/knex");

// GET /api/v1/inventario
async function listar(req, res, next) {
  try {
    const data = await db("Productos")
      .select("ID_Producto", "Nombre_Modelo", "Stock_Disponible", "Precio_Venta");
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/inventario/:idProducto
async function obtenerUno(req, res, next) {
  try {
    const { idProducto } = req.params;

    const p = await db("Productos")
      .select("ID_Producto", "Nombre_Modelo", "Stock_Disponible", "Precio_Venta")
      .where({ ID_Producto: idProducto })
      .first();

    if (!p) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    res.json({ ok: true, data: p });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/inventario/:idProducto (Admin)
// body: { "ajuste": -2 } ó { "nuevoStock": 10 }
async function actualizar(req, res, next) {
  try {
    const { idProducto } = req.params;
    const { ajuste, nuevoStock } = req.body;

    if (ajuste === undefined && nuevoStock === undefined) {
      return res.status(400).json({ ok: false, error: "Debes enviar ajuste o nuevoStock" });
    }

    const p = await db("Productos")
      .select("ID_Producto", "Stock_Disponible")
      .where({ ID_Producto: idProducto })
      .first();

    if (!p) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    let finalStock = p.Stock_Disponible;

    if (nuevoStock !== undefined) {
      finalStock = Number(nuevoStock);
    } else {
      finalStock = Number(p.Stock_Disponible) + Number(ajuste);
    }

    if (finalStock < 0) {
      return res.status(400).json({ ok: false, error: "Stock insuficiente (no puede quedar negativo)" });
    }

    await db("Productos")
      .where({ ID_Producto: idProducto })
      .update({ Stock_Disponible: finalStock });

    const actualizado = await db("Productos")
      .select("ID_Producto", "Nombre_Modelo", "Stock_Disponible")
      .where({ ID_Producto: idProducto })
      .first();

    res.json({ ok: true, data: actualizado });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtenerUno, actualizar };