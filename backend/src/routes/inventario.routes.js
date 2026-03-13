const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate");
const inv = require("../controllers/inventario.controller");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, inv.listar);

router.get(
  "/:idProducto",
  requireAuth,
  param("idProducto").isInt({ min: 1 }).withMessage("idProducto debe ser entero"),
  validate,
  inv.obtenerUno
);

router.patch(
  "/:idProducto",
  requireAuth,
  requireRole("Administrador"),
  param("idProducto").isInt({ min: 1 }).withMessage("idProducto debe ser entero"),
  body("ajuste").optional().isInt().withMessage("ajuste debe ser entero"),
  body("nuevoStock").optional().isInt({ min: 0 }).withMessage("nuevoStock debe ser >= 0"),
  validate,
  inv.actualizar
);

module.exports = router;