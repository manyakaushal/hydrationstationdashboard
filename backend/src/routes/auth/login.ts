import express, {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from '../../client'
import { error } from "console";

const router = express.Router();


router.post('/login', async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where: { 
                email: email,
            },
        })

        if (!user) return res.status(400).send("User not found");

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({error: "Authentication Failed"});
        }
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'}
        );

        res.status(200).json({token});
    }catch (error) {
        res.status(500).json({error: "Login Failed"});
    } 
})

export default router;