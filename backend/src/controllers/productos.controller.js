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
    const { ID_Marca, ID_Categoria } = req.body;

    const marcaExiste = await existeEnTabla("Marcas", "ID_Marca", ID_Marca);
    const categoriaExiste = await existeEnTabla("Categorias", "ID_Categoria", ID_Categoria);

    if (!marcaExiste) return res.status(400).json({ ok: false, error: "ID_Marca no existe" });
    if (!categoriaExiste) return res.status(400).json({ ok: false, error: "ID_Categoria no existe" });

    const nuevo = await Productos.crear(req.body);
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (req.body.ID_Marca) {
      const marcaExiste = await existeEnTabla("Marcas", "ID_Marca", req.body.ID_Marca);
      if (!marcaExiste) return res.status(400).json({ ok: false, error: "ID_Marca no existe" });
    }
    if (req.body.ID_Categoria) {
      const categoriaExiste = await existeEnTabla("Categorias", "ID_Categoria", req.body.ID_Categoria);
      if (!categoriaExiste) return res.status(400).json({ ok: false, error: "ID_Categoria no existe" });
    }

    const actualizado = await Productos.actualizar(id, req.body);

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