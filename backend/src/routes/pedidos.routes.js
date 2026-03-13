const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");
const pedidos = require("../controllers/pedidos.controller");

const router = express.Router();

// POST /api/v1/pedidos
router.post(
  "/",
  requireAuth,
  body("Metodo_Pago")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Metodo_Pago no puede estar vacío")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Metodo_Pago no puede exceder 30 caracteres")
    .bail()
    .escape(),
  body("items").isArray({ min: 1 }).withMessage("items debe ser un array con al menos 1 elemento"),
  body("items.*.ID_Producto")
    .isInt({ min: 1 })
    .withMessage("Cada item debe incluir un ID_Producto válido"),
  body("items.*.Cantidad")
    .isInt({ min: 1 })
    .withMessage("Cada item debe incluir una Cantidad válida"),
  validate,
  pedidos.crear
);

module.exports = router;
