import { Router } from "express";
import { userRoutes } from "./user.routes.js";
import { postRoutes } from "./post.routes.js";
import { authRoutes } from "./auth.routes.js";
const router = Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);

export default router;
