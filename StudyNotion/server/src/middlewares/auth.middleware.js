import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";

// auth
const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.body.token || req.header("Authorisation").replace("Bearer ", "")
        console.log(token, ": from auth middleware");
    
        if(!token) {
            throw new ApiError(403, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password")
        console.log(user);
    
        if(!user) {
            throw new ApiError(401, "Invalid Token")
        }
        req.user = decodedToken
        console.log("User: ", user, " and Decoded Token: ", decodedToken);
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Token")
    }
})

// isStudent
const isStudent = asyncHandler(async(req, res, next) => {
    try {
        if(req.user.accountType != "Student") {
            throw new ApiError(401, "This is the protected route for Students only")
        }
    } catch (error) {
        throw new ApiError(500, "User role cannot be verified. PLease, Try Again")
    }
})

// isInstructor
const isInstructor = asyncHandler(async(req, res, next) => {
    try {
        if(req.user.accountType != "Instructor") {
            throw new ApiError(401, "This is the protected route for Instructors only")
        }
    } catch (error) {
        throw new ApiError(500, "User role cannot be verified. PLease, Try Again")
    }
})

// isAdmin
const isAdmin = asyncHandler(async(req, res, next) => {
    try {
        if(req.user.accountType != "Admin") {
            throw new ApiError(401, "This is the protected route for Admins only")
        }
    } catch (error) {
        throw new ApiError(500, "User role cannot be verified. PLease, Try Again")
    }
})

export {
    auth,
    isStudent,
    isInstructor,
    isAdmin,
}