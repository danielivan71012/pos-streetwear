const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate");
const c = require("../controllers/vendedores.controller");

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
  body("Nombre_Completo").isLength({ min: 3 }).withMessage("Nombre_Completo mínimo 3 caracteres"),
  body("Rol").isIn(["Administrador", "Vendedor"]).withMessage("Rol inválido"),
  body("Email_Contacto").isEmail().withMessage("Email inválido"),
  validate,
  c.create
);

router.put(
  "/:id",
  param("id").isInt().withMessage("id debe ser entero"),
  body("Nombre_Completo").optional().isLength({ min: 3 }),
  body("Rol").optional().isIn(["Administrador", "Vendedor"]),
  body("Email_Contacto").optional().isEmail(),
  validate,
  c.update
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("id debe ser entero"),
  validate,
  c.remove
);

module.exports = router;