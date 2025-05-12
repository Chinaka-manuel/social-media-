import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"



export const signup = async (req,res)=>{
   const {fullName,email,password} = req.body
   try{
   if (password.lenght < 6){
    return res.status(400).json({message:"Password must be at least 6 characters"});
   }
   const user = await User.findOne({email})
   if (user) return res.status(400).json({message: "Email already exist"})
    const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password,salt)
   const newUser = new User(
    {
    fullName,
    email,
    password:hashedPassword
    })
    
    if(newUser){
        //generate jwt here
        generateToken(newUser._id,res)
        await newUser.save()
        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        });
    } else{
        res.status(400).json({message: "Invalid user data"})
    }
} catch (error) {
   
   }
}

export const login = (req,res)=>{
    res.send('login route yee yee')
}

export const logout = (req,res)=>{
    res.send('logout route oo woow ')
}

