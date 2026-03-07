import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env["SECRET_KEY"];
if (!SECRET_KEY) throw new Error("Invalid SECRET_KEY!");

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Missing authentication header!" });

        const token = authHeader.split(" ")[1];
        if(!token) return res.status(401).json({ message: "Invalid authorization format!" });

        jwt.verify(token, SECRET_KEY);
        const decoded = jwt.decode(token, { json: true });

        if (decoded && decoded.login) req.user = { login: decoded.login };

        next();
    } catch (error) {
        console.error("[authMiddleware]: ", error);
        return res.status(401).json({ message: "Invalid authentication!" });
    }
}
