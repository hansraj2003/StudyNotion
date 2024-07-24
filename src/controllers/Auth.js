import User from "../models/User.models.js"
import OTP from "../models/OTP.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError"
import otpGenerator from "otp-generator"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Profile } from "../models/Profile.models.js"

// sendOTP
const sendOTP = asyncHandler(async (req, res) => {
    try {
        // fetch email
        const email = req.body({email});

        // check if user with email id is already registered
        const registeredEmail = await User.findOne({email});

        if (registeredEmail) {
            throw new ApiError(409, "User with this email already exists!")
        }

        // generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated is: ", otp);
        // check if otp is unique
        let isOTPUnique = await OTP.findOne({otp: otp});

        if(isOTPUnique) {
            while (isOTPUnique) {
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });
            }
            
            isOTPUnique = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email,otp};

        // entering otp payload in db
        const otpBody = OTP.create({otpPayload})
        console.log("OTP is created and fed into DB: ",otpBody);

        // returning response
        return res
        .status(201)
        .json(
            new ApiResponse(200, otpBody, "OTP Created Successfully.")
        )

    } catch (error) {
        console.log("Error in sendOTP: ", error);
        throw new ApiError(501, "Error in generating OTP in sendOTP controller", error)
    }
}) 

// signUp
const signUp = asyncHandler(async(req, res) => {
    // fetch data from req body
    const {firstName, lastName, email, password, confirmPassword,accountType, contactNumber, otp} = req.body;
    
    // validate data
    if(!(firstName || lastName || email || password || confirmPassword || otp)) {
        throw new ApiError(403, "All fields are required");
    }

    if([firstName, lastName, email, password, confirmPassword, otp].some((field) => (
        field.trim == ""
    ))) {
        throw new ApiError(403, "All fields are required");
    }

    // check password and confirmPassword
    if(password != confirmPassword) {
        throw new ApiError(403, "Password and ConfirmPassword does not match")
    }

    // check if user exists
    const existingUser = await User.findOne({
        email
    })

    if(existingUser) {
        throw new ApiError(400, "User with this email Already Exists.")
    }

    // find most recent OTP for the user
    const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
    console.log("Your recent OTP is: ", recentOtp);

    // validate OTP
    if(recentOtp.length == 0) {
        throw new ApiError(409, "OTP Not Found")
    }

    if(otp != recentOtp) {
        throw new ApiError(409, "Invalid OTP")
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating entry in DB

    const profileDetails = await Profile.create({
        contactNumber:null,
        gender: null,
        dateOfBirth: null, 
        about: null,

    })

    const user = await User.create({
        firstName,
        lastName,
        password: hashedPassword,
        additionalDetails: profileDetails._id,
        accountType,
        email,
        contactNumber,
        image: `https://api.dicebear.com/9.x/initials/svg?seed= ${firstName} ${lastName}`
    })

    const createdUser = await User.findOne(user._id).select(
        "-password -additionalDetails -image"
    )

    if(!createdUser) {
        // console.log("Error in creating User in signUp");
        throw new ApiError(409, "User  Registration is Unsuccessful. Please Try Again!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )



})

export {
    sendOTP,
    signUp,
}