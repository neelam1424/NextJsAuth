import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'




connect()


//handle post request

export async function POST(request:NextRequest){
    try{
        //grab data from req body
        const reqBody = await request.json()
        //destructuring the reqBody
        const {username,email,password}=reqBody

        //check if user already exists
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400})
        }

        //hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //create new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
        
        //save user to db
        const savedUser = await newUser.save()

        //send response
        return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser
        })


        

    }catch(error: any){
        return NextRequest.json({error:error.message},{status:500})
    }
}