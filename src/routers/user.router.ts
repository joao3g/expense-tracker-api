import express from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", authMiddleware, UserController.getCurrentUser);

export default router;