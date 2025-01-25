import {User} from "../models/User.models.js"
import {OTP} from "../models/OTP.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import otpGenerator from "otp-generator"
import bcrypt from "bcrypt"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Profile } from "../models/Profile.models.js"
import { mailSender } from "../utils/mailSender.js"
import jwt from "jsonwebtoken"

// sendOTP
const sendOTP = asyncHandler(async (req, res) => {
    try {
        // fetch email
        // const email = req.body({email});
        const {email} = req.body;

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
        const otpBody = await OTP.create(otpPayload)        /* just removed curly brackets from otpPayload*/ 
        console.log("OTP is created and fed into DB: ",otpBody);

        // await OTP.find({}).limit(10).exec((err, docs) => {
        //     if (err) {
        //         console.error('Error fetching documents:', err);
        //     } else {
        //         console.log('Documents:', docs);
        //         new ApiResponse(200, docs, "Documents of OTP db")
        //     }
        // });

        // returning response
        return res
        .status(201)
        .json(
            new ApiResponse(200, {email: email, otp: otp}, "OTP Created Successfully.")
        )

    } catch (error) {
        console.log("Error in sendOTP: ", error);
        throw new ApiError(501, "Error in generating OTP in sendOTP controller", error)
    }
}) 

// signUp
const signUp = asyncHandler(async(req, res) => {
    // try {
        // fetch data from req body
        const {firstName, lastName, email, password, confirmPassword,accountType, contactNumber, otp} = req.body;
        
        // validate data
        if(!(firstName || lastName || email || password || confirmPassword || otp)) {
            throw new ApiError(403, "All fields are required");
        }
    
        if([firstName, lastName, email, password, confirmPassword, otp].some((field) => (
            field.trim() === ""
        ))) {
            throw new ApiError(403, "All fields are required");
        }
    
        // check password and confirmPassword
        if(password !== confirmPassword) {
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
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1})/*.limit(1)*/;
        console.log("Your recent OTP is: ", recentOtp.otp , " and req body otp is: ", otp, "type of data of both varaibles: ", typeof(recentOtp.otp), " & ", typeof(otp));
    
        // validate OTP
        if(recentOtp.length == 0) {
            throw new ApiError(409, "OTP Not Found")
        }
    
        if(otp != recentOtp.otp) {
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
        console.log("Created User: ", createdUser);
        
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User Registered Successfully")
        )
    // } catch (error) {
    //     throw new ApiError(500, "Error occured while signing up", error)
    // }
})

// login
const login = asyncHandler(async (req, res) => {
    // fetch email and password from req body
    const {email, password} = req.body

    if(!(email || password)) {
        throw new ApiError(403, "All fields are required")
    }

    // validate both of them
    const user = await User.findOne({email});
    // const findUserWithPassword = await User.findOne({email});

    // if email does not exist
    if (!user) {
        throw new ApiError(403, "User does not exists, please signup");
    }

    
    // if not validated, email or passsword does not match
    const decryptedPassword = await bcrypt.compare(password, user.password)

    if(!decryptedPassword) {
        throw new ApiError(403, "Invalid User Credentials")
    }

    // Creating JWT
    const payload = {
        _id: user._id,
        email: user.email,
        accountType: user.accountType,
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY,
    })

    // feeding token in user
    user.token = token;
    user.password = null;

    const options = {
        httpOnly: true,
        secure: true,
        expiresIn: new Date(Date.now() + 3*24*60*60*1000),
    }

    return res
    .status(200)
    .cookie("token", token, options)
    .json(
        new ApiResponse(200, {
            user, token
        }, "User Logged In Successfully")
    )
})

// Change Password
const changePassword = asyncHandler(async(req, res) => {
    // fetch data for req body
    const {email, password, newPassword, confirmNewPassword} = req.body

    // get old Password, new Password, confirm new Password
    const user = await User.findOne({email})

    // validate
    const decryptedPassword = await bcrypt.compare(password, user.password)
    if(!decryptedPassword) {
        throw new ApiError(403, "Invalid old password", error?.message)
    }

    if(password == newPassword) {
        throw new ApiError(401, "NewPasssword can not be same as Old Password") 
    }

    if (newPassword != confirmNewPassword) {
        throw new ApiError(403, "New password and Confirm New Password does not match, Try Again")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // update password in DB
    user.password = hashedPassword;
    const updatedUser = await user.save();
    // const updatedPassword = await User.findByIdAndUpdate(user._id,
    //     {
    //         $set: {
    //             password: hashedPassword,
    //         }
    //     },
    //     {new: true}
    // )

    // send mail - password Updated
    await mailSender(email, "Password Updated", `Your password for StudyNotion is updated on ${new Date(new Date().toLocaleString()).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}).replace(',', " at")}. If you did not do this, we request you to change your password immediately.`)
    // console.log();
    
    // return response
    return res.status(200).json(
        new ApiResponse(200, {hashedPassword:hashedPassword, newPassword: newPassword, passwordInDb: user.password, updatedUser: user.password},
        "Password Updated Successfully"
        )
    )
})

export {
    sendOTP,
    signUp,
    login,
    changePassword,
}