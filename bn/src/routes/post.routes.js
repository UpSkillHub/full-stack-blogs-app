import express from "express";
export const postRoutes = express.Router();
import postController from "../controllers/post.controller.js";
import { auth, checkOwnership } from "../middlewares/auth.js";

// Public routes
postRoutes.get("", postController.getPosts);
postRoutes.get("/search", postController.searchPosts);
postRoutes.get("/:id", postController.getPost);

// Protected routes
postRoutes.use(auth);
postRoutes.post("", postController.createPost);
postRoutes.put("/:id", checkOwnership("id"), postController.updatePost);
postRoutes.delete("/:id", checkOwnership("id"), postController.deletePost);
postRoutes.post("/:id/like", postController.toggleLike);
postRoutes.post("/:id/comments", postController.addComment);
postRoutes.delete("/:id/comments/:commentId", postController.removeComment);
