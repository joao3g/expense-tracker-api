import z from 'zod';
import { Request, Response } from 'express';
import categoryModel from '../models/category.model.js';
import categoryService from '../services/category.service.js';
import categorySchema from '../schemas/category.schema.js';

const create = async (req: Request, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = categorySchema.create.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { title, description, color } = parsed.data;

        await categoryService.create(req.user.login, title, description, color);

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createCategory]: ", error);
        return res.status(500).json({ message: "Failed to create category!" })
    }
}

const list = async (req: Request, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const result = await categoryService.getByCurrentGroupId(req.user.login);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[listCategories]: ", error);
        return res.status(500).json({ message: "Failed to find categories!" });
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const parsed = categorySchema.update.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id, title, description } = parsed.data;

        await categoryModel.update(id, {
            title,
            description
        });

        return res.sendStatus(200);
    } catch (error) {
        console.error("[updateCategory]: ", error);
        return res.status(500).json({ message: "Failed to update category!" });
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const parsed = categorySchema.remove.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        await categoryModel.remove(id);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[removeCategory]: ", error);
        return res.status(500).json({ message: "Failed to remove category!" })
    }
}

export default { create, list, update, remove };