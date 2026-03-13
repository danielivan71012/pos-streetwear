const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [tipo, token] = header.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ ok: false, error: "Token requerido (Bearer)" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, rol, email }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Token inválido o expirado" });
  }
}

function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, error: "No autenticado" });
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };