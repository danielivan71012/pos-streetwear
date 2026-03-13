const { matchedData } = require("express-validator");
const Vendedores = require("../models/vendedores.model");
const { encryptText } = require("../utils/aes");

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
    const payload = matchedData(req, { locations: ["body"], includeOptionals: true });
    const nuevo = await Vendedores.crear(payload);
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

    const actualizado = await Vendedores.actualizar(id, payload);

    if (!actualizado) return res.status(404).json({ ok: false, error: "Vendedor no encontrado" });

    res.json({ ok: true, data: actualizado });
  } catch (err) {
    next(err);
  }
}

async function updateTelefono(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { Telefono } = matchedData(req, { locations: ["body"], includeOptionals: true });
    const Telefono_Enc = encryptText(Telefono);
    const actualizado = await Vendedores.actualizar(id, { Telefono_Enc });

    if (!actualizado) return res.status(404).json({ ok: false, error: "Vendedor no encontrado" });

    res.json({
      ok: true,
      mensaje: "Teléfono actualizado correctamente",
      data: { ID_Usuario: actualizado.ID_Usuario },
    });
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

module.exports = { getAll, getById, create, update, updateTelefono, remove };
