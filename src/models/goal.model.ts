import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const goalSelect = {
    id: true,
    date: true,
    target: true,
    category: {
        select: {
            id: true,
            title: true
        }
    },
    createdAt: true
}

const create = async (data: Prisma.GoalCreateInput) => {
    const firstDayOfMonthDate = new Date(data.date);
    firstDayOfMonthDate.setUTCDate(1);

    data.date = firstDayOfMonthDate;

    return await prisma.goal.create({ data });
}

const getById = async (id: string) => {
    return await prisma.goal.findUnique({
        where: { id },
        select: goalSelect
    });
}

const getByCategory = async (categoryId: string) => {
    return await prisma.goal.findMany({
        where: { categoryId },
        select: goalSelect
    });
}

const getByDate = async (date: Date) => {
    const firstDayOfMonthDate = new Date(date);
    firstDayOfMonthDate.setUTCDate(1);

    return await prisma.goal.findFirst({
        where: { date: { equals: firstDayOfMonthDate } },
        select: goalSelect
    });
}

const update = async (id: string, data: Prisma.GoalUpdateInput) => {
    if (data.date && (typeof data.date === 'string' || data.date instanceof Date)) {
        const firstDayOfMonthDate = new Date(data.date);
        firstDayOfMonthDate.setUTCDate(1);

        data.date = firstDayOfMonthDate;
    }

    return await prisma.goal.update({
        where: { id },
        data
    });
}

const remove = async (id: string) => {
    return await prisma.goal.delete({
        where: { id }
    });
}

export default { create, getById, getByCategory, getByDate, update, remove };