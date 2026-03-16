import z from 'zod';
import { Request, Response } from 'express';
import groupModel from '../models/group.model.js';
import groupSchema from '../schemas/group.schema.js';

const create = async (req: Request, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = groupSchema.create.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { title, description } = parsed.data;

        await groupModel.create({
            title,
            description,
            users: {
                connect: {
                    login: req.user.login
                }
            }
        });

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createGroup]: ", error);
        return res.status(500).json({ message: "Failed to create group!" })
    }
}

const getByUserLogin = async (req: Request, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Authentication failed!" });

        if (req.body) {
            const parsed = groupSchema.getByUserLogin.safeParse(req.params);
    
            if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

            const { login } = parsed.data;

            const result = await groupModel.getByLogin(login || req.user.login);

            return res.status(200).json(result);
        }

        const result = await groupModel.getByLogin(req.user.login);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getGroupsByUserLogin]: ", error);
        return res.status(500).json({ message: "Failed to find groups!" })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const parsed = groupSchema.update.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id, title, description } = parsed.data;

        await groupModel.update(id, {
            title,
            description
        });

        return res.sendStatus(200);
    } catch (error) {
        console.error("[updateGroup]: ", error);
        return res.status(500).json({ message: "Failed to update group!" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const parsed = groupSchema.remove.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        await groupModel.remove(id);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[removeGroup]: ", error);
        return res.status(500).json({ message: "Failed to remove group!" })
    }
}

export default { create, getByUserLogin, update, remove };