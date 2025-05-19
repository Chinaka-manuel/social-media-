import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudianry.js";



export const signup = async (req,res)=>{
    //getting the fullname,email and password from the client
   const {fullName,email,password} = req.body

   //checking if the password mets the schema requirement 
   try{
   if (password.lenght < 6){
    return res.status(400).json({message:"Password must be at least 6 characters"});
   }

   //checking if the client email already exist
   const user = await User.findOne({email})
   if (user) return res.status(400).json({message: "Email already exist"})

    //generating a salt from bcryptjs
    const salt = await bcrypt.genSalt(10)

    //encrypting/hashing the password using the salt
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
        console.log("Error in signup controller", error.message);
          res.status(500).json({message: "Internal server error"});
   }

   next()
}

export const login = (req,res)=>{
    res.send('login route yee yee')
}

export const logout = (req,res)=>{
    res.send('logout route oo woow ')
}

export const updateProfile = async (req, res) =>{
    try{
        const {profilePic} =req.body;
        const userId = req.user._id;
        if(!profilePic) {
            return res.status(400).json({message: "profile Picture is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
        res.status.json(updatedUser)
    }catch(error){
         console.log("Error in update profile", error.message);
          res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = async (req, res) =>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth", error.message);
        res.status(500).json({message:"internal Server error"});
    }
}

