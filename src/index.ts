import express from 'express';
import cors from 'cors';
import UserRouter from './routers/user.router.js';
import GroupRouter from './routers/group.router.js';
import CategoryRouter from './routers/category.router.js';
import ExpenseRouter from './routers/expense.router.js';
import IncomeRouter from './routers/income.router.js';

const port = 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", UserRouter);
app.use("/group", GroupRouter);
app.use("/category", CategoryRouter);
app.use("/expense", ExpenseRouter);
app.use("/income", IncomeRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});