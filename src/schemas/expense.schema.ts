import { z } from 'zod';
import { PaymentMethod } from '../generated/prisma/enums.js';

const create = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.float64(),
    date: z.iso.date(),
    paymentMethod: z.enum(PaymentMethod),
    category: z.string()
});

const getByMonth = z.object({
    date: z.iso.date()
});

const totalByRange = z.object({
    startDate: z.iso.date(),
    endDate: z.iso.date()
});

const getByTitle = z.object({
    date: z.iso.date().optional(),
    title: z.string()
});

const getSummarizedByMonth = z.object({
    date: z.iso.date()
});

const update = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    amount: z.float64().optional(),
    date: z.iso.date().optional(),
    paymentMethod: z.enum(PaymentMethod).optional(),
    category: z.string().optional()
});

const remove = z.object({
    id: z.string()
});

export default { create, getByMonth, getSummarizedByMonth, getByTitle, totalByRange, update, remove };