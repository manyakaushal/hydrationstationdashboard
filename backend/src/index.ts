import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from './routes/auth/login';
import dashboardRouter from './routes/dashboard';
<<<<<<< HEAD
import sensorDataRouter from './routes/sensorData';
=======
import sensorRoutes from "./routes/sensor/sensorreading";
>>>>>>> jayden-email-sender

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());
//Routes
app.get('/health', (req, res) => {
    res.json({ok: true, message: "Backend is working"});
    console.log("Connection Established.");
})

app.use('/api/auth', authRouter);

app.use('/api/dashboard', dashboardRouter);

<<<<<<< HEAD
app.use('/api/sensor-data', sensorDataRouter);

app.listen(4000, "0.0.0.0", () => {
=======
app.use('/api/sensor-readings', sensorRoutes);

app.listen(PORT, () => {
>>>>>>> jayden-email-sender
    console.log(`Server running on http://localhost:${PORT}`);
})