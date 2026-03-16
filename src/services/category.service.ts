import 'dotenv/config';
import userModel from '../models/user.model.js';
import categoryModel from '../models/category.model.js';

const create = async (userLogin: string, title: string, description: string | undefined, color: string) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");
    
        await categoryModel.create({
            title,
            description,
            color,
            group: {
                connect: {
                    id: userData.group.id
                }
            }
        });
    } catch (error) {
        console.error("[createCategory]: ", error);
        throw error;
    }
}

const getByCurrentGroupId = async (userLogin: string) => {
    try {
        const userData = await userModel.getByLogin(userLogin);
        if (!userData) throw Error("User not found!");
        if (!userData.group?.id) throw Error("User group not found!");
    
        return await categoryModel.getByGroupId(userData.group.id);
    } catch (error) {
        console.error("[getCategoryByCurrentGroupId]: ", error);
        throw error;
    }
}

export default { create, getByCurrentGroupId };