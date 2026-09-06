// Centralized error handler - catches errors passed via next(err) or thrown in async routes
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default fallback
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
}

// 404 handler for unmatched routes
function notFoundHandler(req, res) {
  return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
