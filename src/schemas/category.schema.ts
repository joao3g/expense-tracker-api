import { z } from 'zod';

const create = z.object({
    title: z.string(),
    color: z.hex(),
    description: z.string().optional()
});

const getByUserLogin = z.object({
    login: z.string().optional()
});

const update = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional()
});

const remove = z.object({
    id: z.string()
});

export default { create, getByUserLogin, update, remove };