/**
 * Middleware to handle async errors in Express routes
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Log error for debugging (optional)
      console.error("Error caught by catchAsync:", error);

      // If headers are already sent, pass to Express error handler
      if (res.headersSent) {
        return next(error);
      }

      // Determine status code
      const statusCode = error.statusCode || 500;

      // Send error response
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    });
  };
};

module.exports = catchAsync;
