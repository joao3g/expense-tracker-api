import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const groupSelect = {
    title: true,
    description: true,
    createdAt: true
}

const create = async (data: Prisma.GroupCreateInput) => {
    return await prisma.group.create({ data });
}

const getById = async (id: string) => {
    return await prisma.group.findUnique({
        where: { id },
        select: groupSelect
    });
}

const getByLogin = async (login: string) => {
    return await prisma.group.findFirst({
        where: { users: { some: { login } } },
        select: groupSelect
    });
}

const find = async (skip: number = 0, take: number = 50) => {
    return await prisma.group.findMany({
        skip,
        take,
        select: groupSelect
    });
}

const update = async (id: string, data: Prisma.GroupUpdateInput) => {
    return await prisma.group.update({
        where: { id },
        data
    });
}

const remove = async (id: string) => {
    return await prisma.group.delete({
        where: { id }
    });
}

export default { create, getById, getByLogin, find, update, remove };