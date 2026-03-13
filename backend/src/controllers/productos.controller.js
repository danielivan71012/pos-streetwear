const { matchedData } = require("express-validator");
const Productos = require("../models/productos.model");
const db = require("../db/knex");

async function existeEnTabla(tabla, campoId, id) {
  const row = await db(tabla).where({ [campoId]: id }).first();
  return !!row;
}

async function getAll(req, res, next) {
  try {
    const data = await Productos.obtenerTodos();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await Productos.obtenerPorId(id);

    if (!row) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    res.json({ ok: true, data: row });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = matchedData(req, { locations: ["body"], includeOptionals: true });
    const { ID_Marca, ID_Categoria } = payload;

    const marcaExiste = await existeEnTabla("Marcas", "ID_Marca", ID_Marca);
    const categoriaExiste = await existeEnTabla("Categorias", "ID_Categoria", ID_Categoria);

    if (!marcaExiste) return res.status(400).json({ ok: false, error: "ID_Marca no existe" });
    if (!categoriaExiste) return res.status(400).json({ ok: false, error: "ID_Categoria no existe" });

    const nuevo = await Productos.crear(payload);
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const payload = matchedData(req, { locations: ["body"], includeOptionals: true });

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Debes enviar al menos un campo válido para actualizar",
      });
    }

    if (payload.ID_Marca) {
      const marcaExiste = await existeEnTabla("Marcas", "ID_Marca", payload.ID_Marca);
      if (!marcaExiste) return res.status(400).json({ ok: false, error: "ID_Marca no existe" });
    }

    if (payload.ID_Categoria) {
      const categoriaExiste = await existeEnTabla("Categorias", "ID_Categoria", payload.ID_Categoria);
      if (!categoriaExiste) return res.status(400).json({ ok: false, error: "ID_Categoria no existe" });
    }

    const actualizado = await Productos.actualizar(id, payload);

    if (!actualizado) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    res.json({ ok: true, data: actualizado });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await Productos.eliminar(id);

    if (!deleted) return res.status(404).json({ ok: false, error: "Producto no encontrado" });

    res.json({ ok: true, mensaje: "Producto eliminado" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
