import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authenticateToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({message: "Unauthorized"});
    
    if (!process.env.JWT_SECRET){
        console.error("JWT_SECRET is not set in environment variables.");
        return res.status(500).json({message: "Server misconfiguration"});
    }
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }catch (err){
        return res.status(403).json({message: "Invalid token"});
    }
}