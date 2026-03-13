const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/knex");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const usuario = await db("Usuarios_Vendedores")
      .select("ID_Usuario", "Rol", "Email_Contacto", "PasswordHash")
      .where({ Email_Contacto: email })
      .first();

    if (!usuario || !usuario.PasswordHash) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, usuario.PasswordHash);
    if (!ok) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.ID_Usuario, rol: usuario.Rol, email: usuario.Email_Contacto },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return res.json({ ok: true, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
