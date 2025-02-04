import express from 'express';
import userRouter from './api/users';

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);

// ... rest of your server configuration ... 