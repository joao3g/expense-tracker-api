import express from 'express';
import ExpenseController from '../controllers/expense.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, ExpenseController.create);
router.post("/getByMonth", authMiddleware, ExpenseController.getByMonth);
router.post("/getByTitle", authMiddleware, ExpenseController.getByTitle);
router.post("/getSummarizedByMonth", authMiddleware, ExpenseController.getSummarizedByMonth);
router.delete("/remove/:id", authMiddleware, ExpenseController.remove);
router.patch("/update", authMiddleware, ExpenseController.update);

export default router;