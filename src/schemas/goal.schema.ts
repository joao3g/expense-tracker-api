import { z } from 'zod';

const create = z.object({
    date: z.iso.date(),
    target: z.number(),
    category: z.string(),
});

const getById = z.object({
    id: z.string()
});

const getByCategory = z.object({
    id: z.string()
});

const getByDate = z.object({
    date: z.iso.date()
});

const update = z.object({
    id: z.string(),
    date: z.iso.date(),
    target: z.number(),
    category: z.string()
});

const remove = z.object({
    id: z.string()
});

export default { create, getById, getByDate, getByCategory, update, remove };