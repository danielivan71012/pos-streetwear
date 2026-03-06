function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  res.status(status).json({
    ok: false,
    error: err.message || "Error interno",
  });
}

module.exports = errorHandler;