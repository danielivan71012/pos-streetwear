const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate");
const c = require("../controllers/vendedores.controller");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", c.getAll);

router.get(
  "/:id",
  param("id").isInt().withMessage("id debe ser entero"),
  validate,
  c.getById
);

router.post(
  "/",
  requireAuth,
  requireRole("Administrador"),
  body("Nombre_Completo")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre_Completo mínimo 3 caracteres")
    .bail()
    .escape(),
  body("Rol").isIn(["Administrador", "Vendedor"]).withMessage("Rol inválido"),
  body("Email_Contacto")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email inválido")
    .bail()
    .escape(),
  validate,
  c.create
);

router.put(
  "/:id",
  requireAuth,
  requireRole("Administrador"),
  param("id").isInt().withMessage("id debe ser entero"),
  body("Nombre_Completo")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre_Completo mínimo 3 caracteres")
    .bail()
    .escape(),
  body("Rol").optional().isIn(["Administrador", "Vendedor"]).withMessage("Rol inválido"),
  body("Email_Contacto")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email inválido")
    .bail()
    .escape(),
  validate,
  c.update
);

router.patch(
  "/:id/telefono",
  requireAuth,
  requireRole("Administrador"),
  param("id").isInt({ min: 1 }).withMessage("id debe ser entero"),
  body("Telefono")
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("Telefono inválido"),
  validate,
  c.updateTelefono
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("Administrador"),
  param("id").isInt().withMessage("id debe ser entero"),
  validate,
  c.remove
);

module.exports = router;
