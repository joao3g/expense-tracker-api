import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const expenseSelect = {
    id: true,
    title: true,
    description: true,
    amount: true,
    transactionDate: true,
    dueDate: true,
    paymentMethod: true,
    category: true,
    createdAt: true
}

const create = async (data: Prisma.ExpenseCreateInput) => {
    return await prisma.expense.create({ data });
}

const getById = async (id: string) => {
    return await prisma.expense.findUnique({
        where: { id }
    });
}

const getByRangeAndTitle = async (startDate: Date, endDate: Date, groupId?: string, title?: string) => {
    return await prisma.expense.findMany({
        where: { title, dueDate: { gte: startDate, lte: endDate }, groupId },
        select: expenseSelect
    });
}

const getByTitle = async (title: string, groupId?: string) => {
    return await prisma.expense.findMany({
        where: { title, groupId },
        select: expenseSelect
    });
}

const getSummarizedByRange = async (startDate: Date, endDate: Date, groupId?: string) => {
    const summarizedByTitle = await prisma.expense.groupBy({
        where: {
            groupId,
            dueDate: { gte: startDate, lte: endDate },
        },
        by: ["title"],
        _sum: {
            amount: true
        }
    });

    const summarizedByCategory = await prisma.expense.groupBy({
        where: {
            groupId,
            dueDate: { gte: startDate, lte: endDate },
        },
        by: ["categoryId"],
        _sum: {
            amount: true
        }
    });

    return {
        summarizedByTitle,
        summarizedByCategory: await Promise.all(summarizedByCategory.map(async item => {
            const categoryItem = await prisma.category.findUnique({ where: { id: item.categoryId } });
            return { ...item, categoryTitle: categoryItem?.title, categoryColor: categoryItem?.color };
        }))
    }
}

const update = async (id: string, data: Prisma.ExpenseUpdateInput) => {
    return await prisma.expense.update({
        where: { id },
        data
    });
}

const getTotalByRange = async (startDate: Date, endDate: Date, groupId?: string) => {
    return await prisma.expense.aggregate({
        where: { groupId, dueDate: { gte: startDate, lte: endDate } },
        _sum: { amount: true }
    });
}

const remove = async (id: string) => {
    return await prisma.expense.delete({
        where: { id }
    });
}

export default { create, getByRangeAndTitle, getByTitle, getSummarizedByRange, getById, getTotalByRange, update, remove };