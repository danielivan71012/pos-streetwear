const db = require("../db/knex");

const TABLA = "Usuarios_Vendedores";
const COLUMNAS_PUBLICAS = ["ID_Usuario", "Nombre_Completo", "Rol", "Email_Contacto"];

function obtenerTodos() {
  return db(TABLA).select(COLUMNAS_PUBLICAS).orderBy("ID_Usuario", "desc");
}

function obtenerPorId(id) {
  return db(TABLA).select(COLUMNAS_PUBLICAS).where({ ID_Usuario: id }).first();
}

async function crear(data) {
  const inserted = await db(TABLA).insert(data).returning("ID_Usuario");
  const id = inserted?.[0]?.ID_Usuario ?? inserted?.[0];
  return id ? obtenerPorId(id) : null;
}

async function actualizar(id, data) {
  const updated = await db(TABLA)
    .where({ ID_Usuario: id })
    .update(data)
    .returning("ID_Usuario");

  const updatedId = updated?.[0]?.ID_Usuario ?? updated?.[0];
  return updatedId ? obtenerPorId(updatedId) : null;
}

function eliminar(id) {
  return db(TABLA).where({ ID_Usuario: id }).del();
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
