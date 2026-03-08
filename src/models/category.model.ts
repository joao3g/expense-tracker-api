import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const categorySelect = {
    id: true,
    title: true,
    description: true,
    createdAt: true,
    group: {
        select: {
            id: true,
            title: true
        }
    }
}

const create = async (data: Prisma.CategoryCreateInput) => {
    return await prisma.category.create({ data });
}

const getById = async (id: string) => {
    return await prisma.category.findUnique({
        where: { id },
        select: categorySelect
    });
}

const getByGroupId = async (groupId: string) => {
    return await prisma.category.findMany({
        where: { groupId },
        select: categorySelect
    });
}

const find = async (skip: number = 0, take: number = 50) => {
    return await prisma.category.findMany({
        skip,
        take,
        select: categorySelect
    });
}

const update = async (id: string, data: Prisma.CategoryUpdateInput) => {
    return await prisma.category.update({
        where: { id },
        data
    });
}

const remove = async (id: string) => {
    return await prisma.category.delete({
        where: { id }
    });
}

export default { create, getById, getByGroupId, find, update, remove };