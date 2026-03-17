import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const SECRET_KEY = process.env["SECRET_KEY"];
if (!SECRET_KEY) throw new Error("Invalid SECRET_KEY!");

const login = async (login: string, password: string) => {
    try {
        const userData = await User.getForAuthByLogin(login);
        if (!userData) throw new Error("User not found!");
    
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        
        if (!isPasswordCorrect) throw new Error("Incorrect password!");
        return { 
            token: jwt.sign(
                { 
                    login,
                    name: userData.name,
                    email: userData.email
                }, 
                SECRET_KEY,
                { expiresIn: '1Yr' }
            ) 
        };
    } catch (error) {
        console.error("[login(service)]: ", error);
        throw error;
    }
}

export default { login };