import z from 'zod';
import { Request, Response } from 'express';
import incomeModel from '../models/income.model.js';
import userModel from '../models/user.model.js';
import incomeSchema from '../schemas/income.schema.js';
import incomeService from '../services/income.service.js';

const create = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = incomeSchema.create.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        await incomeService.create(req.user.login, parsed.data);

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createIncome]: ", error);
        return res.status(500).json({ message: "Failed to create income!" })
    }
}

const getById = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = incomeSchema.getById.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        const result = await incomeModel.getById(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getById(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find income!" })
    }
}

const getByUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = incomeSchema.getByUser.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        const userData = await userModel.getByLogin(req.user.login);
        if (!userData) throw Error("User not found!");

        const result = await incomeModel.getByUser(id || userData.id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByUser(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find income!" })
    }
}

const getByGroup = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = incomeSchema.getByUser.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        const userData = await userModel.getByLogin(req.user.login);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        const result = await incomeModel.getByGroup(id || userData.group.id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByGroup(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find income!" })
    }
}

const getByMonth = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = incomeSchema.getByDate.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const userData = await userModel.getByLogin(req.user.login);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        const { date } = parsed.data;

        const result = await incomeModel.getByDate(new Date(date), userData.group.id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByDate(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find income!" })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const parsed = incomeSchema.update.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const currentIncome = await incomeModel.getById(parsed.data.id);

        const toUpdate = {
            id: parsed.data.id || currentIncome?.id,
            title: parsed.data.title || currentIncome?.title,
            amount: parsed.data.amount || currentIncome?.amount,
            date: parsed.data.date || currentIncome?.date,
            group: { connect: { id: currentIncome?.group.id } },
            user: { connect: { id: currentIncome?.user.id } },
        };

        if (parsed.data.date) toUpdate.date = new Date(parsed.data.date);
        await incomeModel.update(parsed.data.id, toUpdate);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[updateIncome]: ", error);
        return res.status(500).json({ message: "Failed to update income!" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const parsed = incomeSchema.remove.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        await incomeModel.remove(id);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[removeIncome]: ", error);
        return res.status(500).json({ message: "Failed to remove income!" })
    }
}

export default { create, getById, getByMonth, getByGroup, getByUser, update, remove };