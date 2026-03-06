const db = require("../db/knex");

const TABLA = "Usuarios_Vendedores";

function obtenerTodos() {
  return db(TABLA).select("*").orderBy("ID_Usuario", "desc");
}

function obtenerPorId(id) {
  return db(TABLA).where({ ID_Usuario: id }).first();
}

async function crear(data) {
  const [row] = await db(TABLA).insert(data).returning("*");
  return row;
}

async function actualizar(id, data) {
  const [row] = await db(TABLA)
    .where({ ID_Usuario: id })
    .update(data)
    .returning("*");
  return row;
}

function eliminar(id) {
  return db(TABLA).where({ ID_Usuario: id }).del();
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };