import 'dotenv/config';
import z from 'zod';
import expenseModel from '../models/expense.model.js';
import groupModel from '../models/group.model.js';
import userModel from '../models/user.model.js';
import expenseSchema from '../schemas/expense.schema.js';

const create = async (userLogin: string, data: z.infer<typeof expenseSchema.create>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");
    
        await expenseModel.create({
            ...data,
            date: new Date(data.date),
            category: { connect: { id: data.category } },
            group: { connect: { id: userData.group.id } }
        });
    } catch (error) {
        console.error("[createExpense(service)]: ", error);
        throw error;
    }
}

const getByMonth = async (userLogin: string, data: z.infer<typeof expenseSchema.getByMonth>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        const startDate = new Date(data.date);
        startDate.setUTCHours(0, 0, 0);
        startDate.setUTCDate(1);

        const endDate = new Date(data.date);
        endDate.setUTCHours(23, 59, 59);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setUTCDate(0);
        
        return await expenseModel.getByRangeAndTitle(startDate, endDate, userData.group.id);
    } catch (error) {
        console.error("[getByMonth(service)]: ", error);
        throw error;
    }
}

const getByTitle = async (userLogin: string, data: z.infer<typeof expenseSchema.getByTitle>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        if (data.date) {
            const startDate = new Date(data.date);
            startDate.setUTCHours(0, 0, 0);
            startDate.setUTCDate(1);

            const endDate = new Date(data.date);
            endDate.setUTCHours(23, 59, 59);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setUTCDate(0);

            return await expenseModel.getByRangeAndTitle(startDate, endDate, userData.group.id, data.title);
        }

        return await expenseModel.getByTitle(data.title);
    } catch (error) {
        console.error("[getByTitle(service)]: ", error);
        throw error;
    }
}

const getSummarizedByMonth = async (userLogin: string, data: z.infer<typeof expenseSchema.getSummarizedByMonth>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        const startDate = new Date(data.date);
        startDate.setUTCHours(0, 0, 0);
        startDate.setUTCDate(1);

        const endDate = new Date(data.date);
        endDate.setUTCHours(23, 59, 59);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setUTCDate(0);

        return await expenseModel.getSummarizedByRange(startDate, endDate, userData.group.id);
    } catch (error) {
        console.error("[getSummarizedByMonth(service)]: ", error);
        throw error;
    }
}

export default { create, getByMonth, getByTitle, getSummarizedByMonth };