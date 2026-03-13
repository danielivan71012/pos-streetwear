const db = require("../db/knex");

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function normalizarItems(items) {
  const acumulado = new Map();

  for (const item of items) {
    const idProducto = Number(item.ID_Producto);
    const cantidad = Number(item.Cantidad);
    acumulado.set(idProducto, (acumulado.get(idProducto) || 0) + cantidad);
  }

  return Array.from(acumulado.entries()).map(([ID_Producto, Cantidad]) => ({
    ID_Producto,
    Cantidad,
  }));
}

// POST /api/v1/pedidos
// body: { Metodo_Pago: "Tarjeta", items: [ { ID_Producto: 12, Cantidad: 2 }, ... ] }
async function crear(req, res, next) {
  try {
    const { Metodo_Pago, items } = req.body;
    const idUsuario = req.user.id;
    const itemsNormalizados = normalizarItems(items || []);

    const resultado = await db.transaction(async (trx) => {
      if (!Array.isArray(items) || items.length === 0 || itemsNormalizados.length === 0) {
        throw httpError(400, "items es requerido y no puede estar vacío");
      }

      const ids = itemsNormalizados.map((item) => item.ID_Producto);
      const productos = await trx("Productos")
        .select("ID_Producto", "Precio_Venta", "Stock_Disponible", "Nombre_Modelo")
        .whereIn("ID_Producto", ids);

      const productosPorId = new Map(productos.map((producto) => [producto.ID_Producto, producto]));

      for (const item of itemsNormalizados) {
        if (!productosPorId.has(item.ID_Producto)) {
          throw httpError(404, `Producto no encontrado: ${item.ID_Producto}`);
        }
      }

      let total = 0;
      for (const item of itemsNormalizados) {
        const producto = productosPorId.get(item.ID_Producto);

        if (Number(producto.Stock_Disponible) < item.Cantidad) {
          throw httpError(
            400,
            `Stock insuficiente para ${producto.Nombre_Modelo} (ID ${producto.ID_Producto})`
          );
        }

        total += Number(producto.Precio_Venta) * item.Cantidad;
      }

      const inserted = await trx("Ventas_Pedidos")
        .insert({
          ID_Usuario: idUsuario,
          Total_Venta: total,
          Metodo_Pago: Metodo_Pago || "Efectivo",
        })
        .returning("ID_Venta");

      const idVenta = inserted?.[0]?.ID_Venta ?? inserted?.[0];

      if (!idVenta) {
        throw httpError(500, "No fue posible crear la venta");
      }

      const detalles = itemsNormalizados.map((item) => {
        const producto = productosPorId.get(item.ID_Producto);
        return {
          ID_Venta: idVenta,
          ID_Producto: item.ID_Producto,
          Cantidad: item.Cantidad,
          Precio_Unitario_Cobrado: Number(producto.Precio_Venta),
        };
      });

      await trx("Detalle_Ventas").insert(detalles);

      for (const item of itemsNormalizados) {
        const updatedRows = await trx("Productos")
          .where({ ID_Producto: item.ID_Producto })
          .andWhere("Stock_Disponible", ">=", item.Cantidad)
          .decrement("Stock_Disponible", item.Cantidad);

        const filasAfectadas = Array.isArray(updatedRows) ? Number(updatedRows[0]) : Number(updatedRows);
        if (!Number.isFinite(filasAfectadas) || filasAfectadas < 1) {
          throw httpError(400, `Stock insuficiente al actualizar ID ${item.ID_Producto} (rollback)`);
        }
      }

      return { idVenta, total };
    });

    return res.status(201).json({
      ok: true,
      data: { ID_Venta: resultado.idVenta, Total_Venta: resultado.total },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { crear };
