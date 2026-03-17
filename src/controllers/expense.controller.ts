import z from 'zod';
import { Request, Response } from 'express';
import expenseModel from '../models/expense.model.js';
import userModel from '../models/user.model.js';
import expenseService from '../services/expense.service.js';
import expenseSchema from '../schemas/expense.schema.js';

const create = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = expenseSchema.create.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        await expenseService.create(req.user.login, parsed.data);

        return res.sendStatus(201);
    } catch (error) {
        console.error("[createExpense(controller)]: ", error);
        return res.status(500).json({ message: "Failed to create expense!" })
    }
}

const getByMonth = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = expenseSchema.getByMonth.safeParse(req.params);
        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const result = await expenseService.getByMonth(req.user.login, parsed.data);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByMonth(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find expenses!" })
    }
}

const getByTitle = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = expenseSchema.getByTitle.safeParse(req.params);
        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const result = await expenseService.getByTitle(req.user.login, parsed.data);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getByTitle(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find expenses!" })
    }
}

const getSummarizedByMonth = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const parsed = expenseSchema.getSummarizedByMonth.safeParse(req.params);
        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const result = await expenseService.getSummarizedByMonth(req.user.login, parsed.data);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[getSummarizedByMonth(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find expenses!" })
    }
}

const totalByRange = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Authentication failed!" });

        const userData = await userModel.getByLogin(req.user.login);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        const parsed = expenseSchema.totalByRange.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const result = await expenseModel.getTotalByRange(new Date(parsed.data.startDate), new Date(parsed.data.endDate), userData.group.id);

        return res.status(200).json(result);
    } catch (error) {
        console.error("[totalByRange(controller)]: ", error);
        return res.status(500).json({ message: "Failed to find expenses!" })
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const parsed = expenseSchema.update.safeParse(req.body);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const currentExpense = await expenseModel.getById(parsed.data.id);

        const toUpdate = {
            id: parsed.data.id || currentExpense?.id,
            title: parsed.data.title || currentExpense?.title,
            description: parsed.data.description || currentExpense?.description,
            amount: parsed.data.amount || currentExpense?.amount,
            date: parsed.data.date || currentExpense?.date,
            paymentMethod: parsed.data.paymentMethod || currentExpense?.paymentMethod,
            group: { connect: { id: currentExpense?.groupId } },
            category: { connect: { id: currentExpense?.categoryId } },
        };

        if (parsed.data.date) toUpdate.date = new Date(parsed.data.date);
        await expenseModel.update(parsed.data.id, toUpdate);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[updateExpense]: ", error);
        return res.status(500).json({ message: "Failed to update expense!" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const parsed = expenseSchema.remove.safeParse(req.params);

        if (!parsed.success) return res.status(400).json(z.treeifyError(parsed.error).properties);

        const { id } = parsed.data;

        await expenseModel.remove(id);

        return res.sendStatus(200);
    } catch (error) {
        console.error("[removeExpense]: ", error);
        return res.status(500).json({ message: "Failed to remove expense!" })
    }
}

export default { create, getByMonth, getByTitle, getSummarizedByMonth, totalByRange, update, remove };