import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req,res)=>{
       try {
         const {fullname,email,phoneNumber,password,role} = req.body;
        //  console.log(fullname,email,phoneNumber,password,role);
         if(!fullname || !email || !phoneNumber || !password ||!role){
            return res.status(400).json({
                message:'All Fields are required',
                success:false
            });
         };
         const file = req.file;
         const fileUri = getDataUri(file);
         const cloudResponse = await cloudinary.uploader.upload(fileUri.content); 
         const user = User.findOne({email});
         if(!user){
            return res.status(400).json({
                message:'email already taken',
                success:true
            })
         }
         const hashedPassword = await bcrypt.hash(password,10)
         await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url
            }
         });
         return res.status(201).json({
            message:"registered successfully",
            success:true
         })
       } catch (error) {
         console.log(error)
       }
}

export const login = async(req,res)=>{
       try {
        const {email,password,role} = req.body;
        if(!email || !password ||!role){
            return res.status(400).json({
                message:"email and password and role is required",
                success:false
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"cannot find email",
                success:false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"password doesn't match",
                success:false
            })
        }
        if(role !== user.role){
            return res.status(400).json({
                message:"role doesn't match",
                success:false
            })
        }
        const tokenData = {
            userId:user._id
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});
        // user = {
        //     _id:user._id,
        //     fullname:user.fullname,
        //     email:user.email,
        //     bio:user.profile.bio,
        //     skills:user.profile.skills,
        //     phoneNumber:user.phoneNumber,
        //     role:user.role,
        // }

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }








        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`welcome back ${user.fullname}`,
            user,
            success:true
        })

       } catch (error) {
         console.log(error)
       }
    }

export const logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logout successfully",
            success:true
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        const file = req.file;
        // console.log(skills);
        
         //cloudinary
         const fileUri = getDataUri(file);
         const cloudResponse =  await  cloudinary.uploader.upload(fileUri.content);

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        // console.log(skillsArray);

         
         const userId = req.id; // token se
         let user = await User.findById(userId);
         if(!user){
            return res.status(400).json({
                message:"cannot find user",
                success:false
            })
        }
        //updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
        //resume

        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url;    //save the cloudinary url
            user.profile.resumeOriginalName = file.originalname  //save the original file name
        }





        await user.save();
        user = {
            _id : user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile : user.profile,



        }
        return res.status(200).json({
            message:"user updated successfully",
            user,
            success:true
        })






    } catch (error) {
        console.log(error)
    }
    

}


