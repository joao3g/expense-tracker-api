import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.post("/create", authMiddleware, categoryController.create);
router.get("/list", authMiddleware, categoryController.list);
router.delete("/delete/:id", authMiddleware, categoryController.remove);
router.patch("/update", authMiddleware, categoryController.update);

export default router;