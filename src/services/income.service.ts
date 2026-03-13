import 'dotenv/config';
import z from 'zod';
import incomeModel from '../models/income.model.js';
import groupModel from '../models/group.model.js';
import userModel from '../models/user.model.js';
import incomeSchema from '../schemas/income.schema.js';

const create = async (userLogin: string, data: z.infer<typeof incomeSchema.create>) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");
    
        await incomeModel.create({
            ...data,
            date: new Date(data.date),
            user: { connect: { login: userLogin } },
            group: { connect: { id: userData.group.id } }
        });
    } catch (error) {
        console.error("[createIncome(service)]: ", error);
        throw error;
    }
}

export default { create };