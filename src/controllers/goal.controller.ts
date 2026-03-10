import z from 'zod';
import { Request, Response } from 'express';
import goalModel from '../models/goal.model.js';
import goalSchema from '../schemas/goal.schema.js';

const create = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = goalSchema.create.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { date, target, category } = parsed.data;

        await goalModel.create({
            date: new Date(date),
            target,
            category: {
                connect: {
                    id: category
                }
            }
        });

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createGoal]: ", error);
        return res.status(500).json({ message: "Failed to create goal!" })
    }
}

const getById = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = goalSchema.getById.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        const result = await goalModel.getById(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getById(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find goal!" })
    }
}

const getByCategory = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = goalSchema.getByCategory.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        const result = await goalModel.getByCategory(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByCategory(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find goal!" })
    }
}

const getByDate = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = goalSchema.getByDate.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { date } = parsed.data;

        const result = await goalModel.getByDate(new Date(date));

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByDate(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find goal!" })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const parsed = goalSchema.update.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id, date, target, category } = parsed.data;

        await goalModel.update(id, {
            date: new Date(date),
            target,
            category: {
                connect: {
                    id: category
                }
            }
        });

        return res.sendStatus(200);
    } catch (error) {
        console.error("[updateGoal]: ", error);
        return res.status(500).json({ message: "Failed to update goal!" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const parsed = goalSchema.remove.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        await goalModel.remove(id);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[removeGoal]: ", error);
        return res.status(500).json({ message: "Failed to remove goal!" })
    }
}

export default { create, getById, getByDate, getByCategory, update, remove };