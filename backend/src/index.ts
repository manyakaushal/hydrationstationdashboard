import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/health', (req, res) => {
    res.json({ok: true, message: "Backend is working"});
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})