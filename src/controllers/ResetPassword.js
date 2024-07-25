import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/User.models"
import { ApiError } from "../utils/ApiError"
import { mailSender } from "../utils/mailSender"
import { ApiResponse } from "../utils/ApiResponse"
import bcrypt from "bcrypt"

// reset Password Token
const resetPasswordToken = asyncHandler(async(req, res) => {
    try {
        // get email from req body
        const {email} = req.body
    
        // check user for this email, email validation
        const user = await User.findOne({email})
        
        if (!user) {
            throw new ApiError(401, "Invalid Email")
        }
    
        // generate token
        const token = crypto.randomUUID()
    
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email}, {
            token: token,
            expiresIn: new Date.now() + 5*60*1000,
        },
        {new: true})  /* this new means new document will be saved in that variable if new is not set to true then variable will refer to old doc*/
    
        // create url
        const url = `http://locahost:3000/update-password/${token}`
    
        // send url by mailsender
        await mailSender(email, `Reset Your StudyNotion Account Password`, `This mail is regarding the updation of your password. Click the link to reset your password: ${url}`)
    
        // return response
        return res.status(200).json(
            new ApiResponse(200, {updatedDetails}, "Your Password token is set")
        )
    } catch (error) {
        console.log("Error in resetPasswordToken: ", error)
        throw new ApiError(500, "Error while generating reset Password Token", error?.message)
    }
})

// reset Password
const resetPassword = asyncHandler(async (req, res) => {
    try {
        // fetch new Password, token, confirmPassword
        const {newPassword, token, confirmPassword} = req.body                   /* As token is present in url, it cannot be fetched directly from the body. So from frontend, this token is fed into body*/
    
        // validation
        if(newPassword != confirmPassword) {
            throw new ApiError(401, "Password does not match")
        }
    
        if (newPassword.trim == "" && confirmPassword.trim == "") {
            throw new ApiError(401, "Password Fields cannot be empty")
        }
    
        // get user details from DB using TOKEN
        const user = await User.findOne(token)
    
        if(!user) {
            throw new ApiError(401, "Unauthorised Token")
        }
    
        // check token time
        if(user.expiresIn < Date.now()) {
            throw new ApiError(401, "Session Time out. Try Again")
        }
    
        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
    
        // password Update
        // user.password = hashedPassword
    
        const updatedDetails = await User.findOneAndUpdate(user?._id, {
            password: hashedPassword,
        }, {new: true})
    
        return res.status(200).json(
            new ApiResponse(200, {
                user: updatedDetails, hashedPassword, token
            }, "Password Resetted Successfully")
        )
    
    } catch (error) {
        console.log("Error while resetting Password: ", error);
        throw new ApiError(500, "Error while resetting Password", error?.message)
    }


})

export {
    resetPasswordToken,
    resetPassword,
}