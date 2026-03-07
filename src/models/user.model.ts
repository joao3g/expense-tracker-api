import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = Number(process.env["SALT_ROUNDS"]);

if (!SALT_ROUNDS || Number.isNaN(SALT_ROUNDS)) throw new Error("Invalid SALT_ROUNDS!");

const userSelect = {
    id: true,
    email: true,
    login: true,
    name: true,
    group: {
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true
        }
    },
    createdAt: true
}

const create = async (data: Prisma.UserCreateInput) => {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    await prisma.user.create({ data: { ...data, password: hash } });

    return;
}

const getById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        select: userSelect
    });
}

const getByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: userSelect
    });
}

const getByLogin = async (login: string) => {
    return await prisma.user.findUnique({
        where: { login },
        select: userSelect
    });
}

const getForAuthByLogin = async (login: string) => {
    return await prisma.user.findUnique({
        where: { login },
        select: {
            login: true,
            password: true
        }
    });
}

const find = async (skip: number = 0, take: number = 50) => {
    return await prisma.user.findMany({
        skip,
        take,
        select: userSelect
    });
}

const update = async (id: string, data: Prisma.UserUpdateInput) => {
    const updateData = { ...data };

    if (typeof data.password === "string") updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    else if (data.password && typeof data.password === "object" && 'set' in data.password && typeof data.password.set === "string") {
        updateData.password = await bcrypt.hash(data.password.set, SALT_ROUNDS);
    }

    return await prisma.user.update({
        where: { id },
        data: updateData
    });
}

const remove = async (id: string) => {
    return await prisma.user.delete({
        where: { id }
    });
}

export default { create, getById, getByLogin, getByEmail, getForAuthByLogin, find, update, remove };