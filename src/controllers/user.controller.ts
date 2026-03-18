import z from 'zod';
import { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import userService from '../services/user.service.js';
import authSchema from '../schemas/auth.schema.js';

const register = async (req: Request, res: Response) => {
    try {
        const parsed = authSchema.register.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { login, password, email, name } = parsed.data;

        await userModel.create({
            login,
            password,
            email,
            name
        });

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createUser]: ", error);
        return res.status(500).json({ message: "Failed to create user!" })
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const parsed = authSchema.login.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { login, password } = parsed.data;

        const result = await userService.login(login, password);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[login(controller)]: ", error);
        return res.status(500).json({ message: "Failed on login!" })
    }
}

const getCurrentUser = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

    return res.status(200).json(req.user);
}

export default { login, register, getCurrentUser };