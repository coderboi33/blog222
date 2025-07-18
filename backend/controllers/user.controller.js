import { User } from "../models/user.model.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"

export const register=async(req,res)=>{
    try {
        const {firstName, lastName, email, password}=req.body;
        if(!firstName||!lastName||!email||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password must be atleast 4 digits "
            })
        }
        const existingUserByEmail= await User.findOne({email:email});
        if(existingUserByEmail){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
        }) 
        return res.status(201).json({
            success:true,
            message:"Account created successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password}= req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory"
            });
        }
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or Password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Incorrect Credentials"
            })
        }
        const token= await jwt.sign({userId:user._id},process.env.SECRET_KEY, {expiresIn:"1d"})
        return res.status(200).cookie("token",token, {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:"strict"}).json({
            success:true,
            message:`Welcome back ${user.firstName}`,
            user 
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}

export const logout = async (__dirname, res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            success:true,
            message:"Logout Successfully"
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const userId=req.id;
        const {firstName,lastName,occupation,bio,instagram,facebook,linkedin,github}=req.body;
        const file=req.file;
        let cloudResponse;
        if(file){

            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        // console.log(cloudResponse)

        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({
                message:'User not found',
                success:false,
            })
        }

        //updating data
        if(firstName) user.firstName = firstName
        if(lastName) user.lastName = lastName
        if(occupation) user.occupation=occupation
        if(instagram) user.instagram=instagram
        if(facebook) user.facebook=facebook
        if(linkedin) user.linkedin=linkedin
        if(github) user.github=github
        if(bio) user.bio=bio
        if(file) user.photoUrl= cloudResponse.secure_url

        await user.save();
        return res.status(200).json({
            message:"Profile Updated successfully",
            success:true,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
} 

export const getAllUsers = async(req,res)=>{
    try {
        const users = await User.find().select("-password") //exclude password field
        res.status(200).json({
            success:true,
            message:"User list fetched successfully",
            total:users.length,
            users
        })
    } catch (error) {
        console.error("Error fetching User list : ",error)
        res.status(500).json({
            success:false,
            message:"Failed to fetch users"
        })
    }
}