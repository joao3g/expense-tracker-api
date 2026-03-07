import { z } from 'zod';

const login = z.object({
    login: z.string(),
    password: z.string()
});

const register = z.object({
    login: z.string(),
    password: z.string(),
    email: z.email(),
    name: z.string()
});

export default { login, register };