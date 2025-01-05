const jwt = require("jsonwebtoken");
const UserService = require("../services/users/user.service");

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await UserService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid token. User not found.",
        });
      }

      // Attach user to request object
      req.user = user;

      // Optional: Check if token is about to expire and issue a new one
      const tokenExp = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExp = tokenExp - now;

      // If token will expire in less than 15 minutes, issue a new one
      if (timeUntilExp < 15 * 60 * 1000) {
        const newToken = UserService.generateToken(user._id);
        res.setHeader("X-New-Token", newToken);
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

/**
 * Optional: Middleware to check if user has required role
 * @param {string[]} roles - Array of required roles
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

/**
 * Optional: Middleware to check if user owns the resource
 * @param {string} paramName - Name of the parameter containing resource ID
 */
const checkOwnership = (paramName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.params[paramName] !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Resource ownership required.",
      });
    }

    next();
  };
};

module.exports = {
  auth,
  checkRole,
  checkOwnership,
};
