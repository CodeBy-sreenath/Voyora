import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from "@/app/lib/mongodb";
import User from "@/app/lib/models/User";
export async function POST(req){
    try{
        const{email,password}=req.json()
        if(!email || !password)
        {
            return NextResponse.json({error:"email and password are required "},{status:400})
            
        }
        await connectDB()
        const user=await User.findOne({email:email.toLowerCase().trim()})
        if(!user)
        {
           return  NextResponse.json({error:"Invalid email or password"},{status:401})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return NextResponse.json({error:"invalid email or password"},{status:401})
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        const response=NextResponse.json({message:"Sign in successful",token})
        response.cookies.set('token',token,{httpOnly:true,path:'/',maxAge:7*24*60*60})
        return response
    }
    catch(error)
    {
        console.error('Signin error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
    }
