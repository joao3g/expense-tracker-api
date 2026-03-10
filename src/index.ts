import express from 'express';
import UserRouter from './routers/user.router.js';
import GroupRouter from './routers/group.router.js';
import CategoryRouter from './routers/category.router.js';
import ExpenseRouter from './routers/expense.router.js';
import GoalRouter from './routers/goal.router.js';

const port = 3000;

const app = express();

app.use(express.json());

app.use("/auth", UserRouter);
app.use("/group", GroupRouter);
app.use("/category", CategoryRouter);
app.use("/expense", ExpenseRouter);
app.use("/goal", GoalRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});