import express from 'express';
import ExpenseController from '../controllers/expense.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, ExpenseController.create);
router.post("/totalByRange", authMiddleware, ExpenseController.totalByRange);
router.get("/getByMonth/:date", authMiddleware, ExpenseController.getByMonth);
router.get("/getByTitle/:title", authMiddleware, ExpenseController.getByTitle);
router.get("/getSummarizedByMonth/:date", authMiddleware, ExpenseController.getSummarizedByMonth);
router.delete("/remove/:id", authMiddleware, ExpenseController.remove);
router.patch("/update", authMiddleware, ExpenseController.update);

export default router;