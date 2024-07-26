import { Course } from "../models/Course.models.js";
import { Tags } from "../models/Tags.models.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import { uploadImage } from "../utils/cloudinary.js";

// Create Course
const createCourse = asyncHandler(async(req, res) => {
    // fetch Data
    const {courseName, price, thumbnail, tag, whatYouWillLearn} = req.body

    const thumbnailImage = req.files?.thumbnail;

    // validate

    if(!(courseName || price || thumbnail || tag || whatYouWillLearn || thumbnailImage)) {
        throw new ApiError(401, "All fields are requied")
    }

    // Check Tag is valid or not

    const tagDetails = await Tags.findById(tag).select("-description -course")

    if(!tagDetails) {
        throw new ApiError(401, "Tag Details not found")
    }

    // is Instructor
    const userId = req.user.id;                      /* This code comes from jwt in login where we send payload with user.id */
    const instructorDetails = await User.findById({userId});
    console.log("Instructor Details: ", instructorDetails);

    if(!instructorDetails) {
        throw new ApiError(404, "Not Found");
    }

    // upload Thumbnail Image into Cloudinary

    const thumbnailUpload = await uploadImage(thumbnailImage, process.env.CLOUDINARY_FOLDER_NAME)

    // save the entry in DB
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        whatYouWillLearn,
        Instructor: instructorDetails._id,
        price,
        thumbnail: thumbnailUpload?.url,
        tag,
    })

    const createdCourse = await Course.findById(newCourse?._id)

    if(!createdCourse) {
        throw new ApiError(500, "Error occured while creating course. Please Try Again")
    }

    // add this course into user schema of Instructor
    const updatedUser = await User.findByIdAndUpdate(
        instructorDetails._id,
        {
            $push: {
                courses: newCourse._id,
            }
        },
        {new: true}
    )

    if(!updatedUser) {
        throw new ApiError(500, "Error while feeding course id in user schema of Instructor")
    }

    // add course into Tag Schema
    await Tags.findByIdAndUpdate(
        tagDetails?._id,
        {
            $push:{
                course: newCourse?._id,
            }
        },
    )

    // return res

    res.status(200).json(
        new ApiResponse(200, {createCourse, updatedUser}, "Course Created Successfully")
    )

})

// get all courses
const allCourses = asyncHandler(async(req, res) => {
    const courseDetails = await Course.find().select("-courseDescription -whatYouWillLearn -courseContent -tag").populate("Instructor").exec();

    if(!courseDetails) {
        throw new ApiError(500, "Error while fetching course details");
    }

    return res.status(200).json(
        new ApiResponse(200, courseDetails, "Course Details Recieved Successfully")
    )
})

export {
    createCourse,

}