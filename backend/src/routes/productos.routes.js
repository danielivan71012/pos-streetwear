const express = require("express");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate");
const c = require("../controllers/productos.controller");
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
  body("ID_Marca").isInt({ min: 1 }).withMessage("ID_Marca debe ser entero >= 1"),
  body("ID_Categoria").isInt({ min: 1 }).withMessage("ID_Categoria debe ser entero >= 1"),
  body("Nombre_Modelo")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre_Modelo mínimo 2 caracteres")
    .bail()
    .escape(),
  body("Atributo_Talla_Medida")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Atributo_Talla_Medida requerido")
    .bail()
    .escape(),
  body("Precio_Venta").isFloat({ min: 0 }).withMessage("Precio_Venta debe ser >= 0"),
  body("Stock_Disponible").isInt({ min: 0 }).withMessage("Stock_Disponible debe ser >= 0"),
  validate,
  c.create
);

router.put(
  "/:id",
  requireAuth,
  requireRole("Administrador"),
  param("id").isInt().withMessage("id debe ser entero"),
  body("ID_Marca").optional().isInt({ min: 1 }),
  body("ID_Categoria").optional().isInt({ min: 1 }),
  body("Nombre_Modelo")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nombre_Modelo mínimo 2 caracteres")
    .bail()
    .escape(),
  body("Atributo_Talla_Medida")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Atributo_Talla_Medida requerido")
    .bail()
    .escape(),
  body("Precio_Venta").optional().isFloat({ min: 0 }),
  body("Stock_Disponible").optional().isInt({ min: 0 }),
  validate,
  c.update
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
