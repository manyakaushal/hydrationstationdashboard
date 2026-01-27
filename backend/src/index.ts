import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from './routes/auth/login';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());
//Routes
app.get('/health', (req, res) => {
    res.json({ok: true, message: "Backend is working"});
})

app.use('/api/auth', authRouter);

app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})