import express from "express";
export const userRoutes = express.Router();
import userController from "../controllers/user.controller.js";
// const auth = require("../middleware/auth");

// Public routes
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/reset-password", userController.resetPassword);

// Protected routes
// userRoutes.use(auth); // Authentication middleware
userRoutes.get("", userController.getAllUsers);
userRoutes.get("/:id", userController.getUserById);
userRoutes.put("/:id", userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);
userRoutes.put("/change-password", userController.changePassword);
userRoutes.put("/profile", userController.updateProfile);
userRoutes.get("/search", userController.searchUsers);
userRoutes.get("/activity/:id", userController.getUserActivity);
userRoutes.post("/activity", userController.logActivity);
