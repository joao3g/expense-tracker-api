import 'dotenv/config';
import z from 'zod';
import expenseModel from '../models/expense.model.js';
import userModel from '../models/user.model.js';
import expenseSchema from '../schemas/expense.schema.js';

function calculateNextInvoiceDate(date: Date, cardClosingDay: number) {
    const dueDate = new Date(date);
    dueDate.setDate(cardClosingDay + 1);
    if (date.getDate() >= cardClosingDay) dueDate.setMonth(dueDate.getMonth() + 1);

    return dueDate;
}

const create = async (userLogin: string, data: z.infer<typeof expenseSchema.create>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");

        await expenseModel.create({
            title: data.title,
            description: data.description,
            paymentMethod: data.paymentMethod,
            amount: data.amount,
            transactionDate: new Date(data.date),
            dueDate: data.paymentMethod === "CREDIT" ? calculateNextInvoiceDate(new Date(data.date), 3) : new Date(data.date),
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

const update = async (data: z.infer<typeof expenseSchema.update>) => {
    const currentExpense = await expenseModel.getById(data.id);

    const toUpdate = {
        id: data.id || currentExpense?.id,
        title: data.title || currentExpense?.title,
        description: data.description || currentExpense?.description,
        amount: data.amount || currentExpense?.amount,
        paymentMethod: data.paymentMethod || currentExpense?.paymentMethod,
        transactionDate: data.date || currentExpense?.transactionDate,
        dueDate: data.date || currentExpense?.dueDate,
        group: { connect: { id: currentExpense?.groupId } },
        category: { connect: { id: currentExpense?.categoryId } },
    };

    if (data.date) {
        toUpdate.transactionDate = new Date(data.date);
        toUpdate.dueDate = new Date(data.date);
        toUpdate.dueDate = toUpdate.paymentMethod === "CREDIT" ? calculateNextInvoiceDate(toUpdate.transactionDate, 3) : new Date(data.date);
    }
    
    return await expenseModel.update(data.id, toUpdate);
}

export default { create, getByMonth, getByTitle, getSummarizedByMonth, update };