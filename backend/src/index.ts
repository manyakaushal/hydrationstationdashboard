import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from './routes/auth/login';
import dashboardRouter from './routes/dashboard';
import sensorDataRouter from './routes/sensorData';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());

app.use(express.json());
//Routes
app.get('/health', (req, res) => {
    res.json({ok: true, message: "Backend is working"});
    console.log("Connection Established.");
})

app.use('/api/auth', authRouter);

app.use('/api/dashboard', dashboardRouter);

app.use('/api/sensor-data', sensorDataRouter);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});