const knex = require("knex");
require("dotenv").config();

const db = knex({
  client: "mssql",
  connection: {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true",
    },
  },
  pool: { min: 2, max: 10 },
});

module.exports = db;