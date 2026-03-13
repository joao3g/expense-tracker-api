import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const incomeSelect = {
    id: true,
    title: true,
    date: true,
    amount: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        }
    },
    group: {
        select: {
            id: true,
            title: true
        }
    },
    createdAt: true
}

const create = async (data: Prisma.IncomeCreateInput) => {
    const firstDayOfMonthDate = new Date(data.date);
    firstDayOfMonthDate.setUTCDate(1);

    data.date = firstDayOfMonthDate;

    return await prisma.income.create({ data });
}

const getById = async (id: string) => {
    return await prisma.income.findUnique({
        where: { id },
        select: incomeSelect
    });
}

const getByUser = async (userId: string) => {
    return await prisma.income.findMany({
        where: { userId },
        select: incomeSelect
    });
}

const getByGroup = async (groupId: string) => {
    return await prisma.income.findMany({
        where: { groupId },
        select: incomeSelect
    });
}

const getByDate = async (date: Date) => {
    const firstDayOfMonthDate = new Date(date);
    firstDayOfMonthDate.setUTCDate(1);

    return await prisma.income.findFirst({
        where: { date: { equals: firstDayOfMonthDate } },
        select: incomeSelect
    });
}

const update = async (id: string, data: Prisma.IncomeUpdateInput) => {
    if (data.date && (typeof data.date === 'string' || data.date instanceof Date)) {
        const firstDayOfMonthDate = new Date(data.date);
        firstDayOfMonthDate.setUTCDate(1);

        data.date = firstDayOfMonthDate;
    }

    return await prisma.income.update({
        where: { id },
        data
    });
}

const remove = async (id: string) => {
    return await prisma.income.delete({
        where: { id }
    });
}

export default { create, getById, getByGroup, getByUser, getByDate, update, remove };