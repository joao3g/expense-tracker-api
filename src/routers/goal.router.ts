import express from 'express';
import GoalController from '../controllers/goal.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, GoalController.create);
router.post("/getById/:id", authMiddleware, GoalController.getById);
router.post("/getByCategory/:id", authMiddleware, GoalController.getByCategory);
router.post("/getByDate/:date", authMiddleware, GoalController.getByDate);
router.delete("/remove/:id", authMiddleware, GoalController.remove);
router.patch("/update", authMiddleware, GoalController.update);

export default router;