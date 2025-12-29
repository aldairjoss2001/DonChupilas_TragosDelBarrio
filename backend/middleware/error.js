export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = '¡Uy! Ese ID no existe, Don.';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = '¡Opa! Ese dato ya existe en el sistema.';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '¡Uy! Algo salió mal en el servidor, Don.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
