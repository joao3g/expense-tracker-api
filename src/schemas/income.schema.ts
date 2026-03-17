import { z } from 'zod';

const create = z.object({
    title: z.string(),
    date: z.iso.date(),
    amount: z.number()
});

const getById = z.object({
    id: z.string()
});

const getByUser = z.object({
    id: z.string().optional()
});

const totalByRange = z.object({
    startDate: z.iso.date(),
    endDate: z.iso.date()
});

const getByGroup = z.object({
    id: z.string().optional()
});

const getByDate = z.object({
    date: z.iso.date()
});

const update = z.object({
    id: z.string(),
    title: z.string().optional(),
    date: z.iso.date().optional(),
    amount: z.number().optional()
});

const remove = z.object({
    id: z.string()
});

export default { create, getById, getByDate, getByUser, getByGroup, totalByRange, update, remove };