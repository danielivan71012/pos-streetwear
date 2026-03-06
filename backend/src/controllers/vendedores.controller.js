const Vendedores = require("../models/vendedores.model");

async function getAll(req, res, next) {
  try {
    const data = await Vendedores.obtenerTodos();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await Vendedores.obtenerPorId(id);

    if (!row) return res.status(404).json({ ok: false, error: "Vendedor no encontrado" });

    res.json({ ok: true, data: row });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const nuevo = await Vendedores.crear(req.body);
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const actualizado = await Vendedores.actualizar(id, req.body);

    if (!actualizado) return res.status(404).json({ ok: false, error: "Vendedor no encontrado" });

    res.json({ ok: true, data: actualizado });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await Vendedores.eliminar(id);

    if (!deleted) return res.status(404).json({ ok: false, error: "Vendedor no encontrado" });

    res.json({ ok: true, mensaje: "Vendedor eliminado" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };