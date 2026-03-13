const express = require("express");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");
const { login } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

// POST /api/v1/auth/login
router.post(
  "/login",
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email inválido")
    .bail()
    .escape(),
  body("password").isLength({ min: 4 }).withMessage("Password requerido"),
  validate,
  login
);

// GET /api/v1/auth/me (protegido con JWT)
router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
