import express from "express";
export const authRoutes = express.Router();
// const authController = require("../controllers/auth.controller");
import authController from "../controllers/auth.controller.js";
// const auth = require("../middleware/auth");

// Public routes
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/request-reset", authController.requestPasswordReset);
authRoutes.post("/reset-password", authController.resetPassword);
authRoutes.post("/verify-token", authController.verifyToken);
authRoutes.post("/refresh-token", authController.refreshToken);

// Protected routes
// authRoutes.use(auth);
authRoutes.post("/logout", authController.logout);
authRoutes.post("/change-password", authController.changePassword);
