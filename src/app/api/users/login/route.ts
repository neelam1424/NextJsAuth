import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {

    try{
        const reqBody = await request.json()
        const {email,password} = reqBody
        //check if user already exists
        const user= await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"},{status: 400})
        }
        //compare the password
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid Password"},{status: 400})
        }



        //create token and send it in response
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,{expiresIn: "1d"})
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user
        })
        //set token in cookies
        response.cookies.set("token",token,{
            httpOnly: true,
            path:'/'
        })

        //send response
        return response

    }catch (error:any){
        return NextResponse.json({error: error.message},{status: 500})
    }

}