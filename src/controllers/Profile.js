import { Course } from "../models/Course.models";
import { Profile } from "../models/Profile.models";
import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";


// Create Profile
const profile = asyncHandler(async (req, res) => {
    try {
        // fetch data from req body
        const {gender, dateOfBirth="", about="", contactNumber} = req.body
        const userId = req.user.id
    
        // validate
        if(!(contactNumber || gender) || contactNumber.trim() == "" || gender.trim() == "") {
            throw new  ApiError(403, "* marked fields are required");
        }
        if(!userId) {
            throw new  ApiError(500, "Missing Properties");
        }
        // gender = gender.trim();
        // dateOfBirth = dateOfBirth.trim();
        // about = about.trim();
    
        // update Profile
        const profileId = await User.findById(userId).select("-firstName -lastName -email -password -accountType -courses -image -courseProgress -token -expiresIn")

        const profileDetails = await Profile.findById(profileId)
        
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.save();
        
        // return res
        return res.status(200).json(
            new ApiResponse(200, {newProfile, updatedUser}, "Profile updated successfully")
        ) 
    } catch (error) {
        throw new ApiError(500, "Error occurred while updating Profile", error?.message);
    }

})

// delete Profile
const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);
    if(!userDetails) {
        throw new ApiError(500, "Error occured while fetching userDetails")
    }

    const deleteprofile = await Profile.findByIdAndDelete(userDetails.additionalDetails);
    const deleteUserFromCourseEnrolled = await Course.findByIdAndUpdate(userDetails.courses, {
        $pop: {
            studentsEnrolled: userId,
        }
    }, {new: true})
    const deleteUser = await User.findOneAndDelete(userId)

    return res.status(200).json(
        new ApiResponse(200, deleteUserFromCourseEnrolled, "Account Deleted Successfully")
    )

})

const getAllUserDetails = asyncHandler(async(req, res) => {
    try {
        const id = req.user.id;
    
        const user = await User.findById(id).populate("additionalDetails").exec();
    
        if(!user) {
            throw new ApiError(500, "User cannot be found", error?.message);
        }
    
        return res.status(200).json(
            new ApiResponse(200, user, "User Details fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, "User cannot be found", error?.message)
    }
})

export {
    profile,
    deleteAccount,
    getAllUserDetails,
}
