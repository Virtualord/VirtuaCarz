import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// user auth
export const userAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(402).send({
                success: false,
                message: "Token not found"
            })
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error)
        res.status(402).send({
            success: false,
            message: "Error in User Auth",
            error
        })
    }
}

// Admin Middleware
export const isAdmin = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.user.id);
        if (user.isAdmin !== true) {
            return res.status(402).send({
                success: false,
                message: "Unauthorized user",
            });
        } else {
            next();
        } 
    } catch(error) {
        console.log(error);
        res.status(402).send({
            success: false,
            message: "Error in Admin auth",
            error,
        });
    }
}