import express from 'express';
import IncomeController from '../controllers/income.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, IncomeController.create);
router.get("/getById/:id", authMiddleware, IncomeController.getById);
router.get("/getByUser{/:id}", authMiddleware, IncomeController.getByUser);
router.get("/getByMonth/:date", authMiddleware, IncomeController.getByMonth);
router.get("/getByGroup{/:id}", authMiddleware, IncomeController.getByGroup);
router.delete("/remove/:id", authMiddleware, IncomeController.remove);
router.patch("/update", authMiddleware, IncomeController.update);

export default router;