"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../../client"));
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user)
            return res.status(400).send("User not found");
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication Failed" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Login Failed" });
    }
});
exports.default = router;
//# sourceMappingURL=login.js.map