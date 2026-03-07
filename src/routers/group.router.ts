import express from 'express';
import GroupController from '../controllers/group.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/create", authMiddleware, GroupController.create);
router.post("/getByLogin", authMiddleware, GroupController.getByUserLogin);
router.delete("/remove/:id", authMiddleware, GroupController.remove);
router.patch("/update", authMiddleware, GroupController.update);

export default router;