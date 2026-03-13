const express = require("express");
require("dotenv").config();

const helmet = require("helmet");
const db = require("./db/knex");

const inventarioRoutes = require("./routes/inventario.routes");

const pedidosRoutes = require("./routes/pedidos.routes");

const authRoutes = require("./routes/auth.routes");
const vendedoresRoutes = require("./routes/vendedores.routes");
const productosRoutes = require("./routes/productos.routes");


const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 1) Middlewares globales (primero)
app.use(helmet());
app.use(express.json());

// 2) Rutas base
app.get("/health", (req, res) => {
  res.json({ ok: true, mensaje: "API POS Streetwear funcionando" });
});

app.get("/db-test", async (req, res) => {
  try {
    await db.raw("SELECT 1 AS ok");
    res.json({ ok: true, mensaje: "Conexión a SQL Server OK" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 3) Rutas API (antes del errorHandler y antes del listen)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vendedores", vendedoresRoutes);
app.use("/api/v1/productos", productosRoutes);
app.use("/api/v1/inventario", inventarioRoutes);
app.use("/api/v1/pedidos", pedidosRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// 4) Error handler (al final)
app.use(errorHandler);

// 5) Levantar servidor (último)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
