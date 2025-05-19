import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req, res) => {
    try{
        const token = req.cookie.jwt;
        if (!token){
            return res.status(401).json({message:"Unauthorized - no token provided"});
        }

        //to grab the token from the cookies we use a library called the cookie parser.
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"unauthorized - invalide token"})
        }
        const user = await User.findById(decoded.userId).select("-password")

        if (!user){
            res.status(404).json({ message:"user not found"})
        }
        req.user = user
        next()

    }catch (error){
        console.log("Error in protectRoute middleware: ", error.message)
        res.status(500).json({message:"internal error"})
    }
}