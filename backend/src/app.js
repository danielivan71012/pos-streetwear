const express = require("express");
require("dotenv").config();

const db = require("./db/knex");
const app = express();

const productosRoutes = require("./routes/productos.routes");

const vendedoresRoutes = require("./routes/vendedores.routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.use("/api/v1/vendedores", vendedoresRoutes);
app.use("/api/v1/productos", productosRoutes);
app.use(errorHandler);
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));