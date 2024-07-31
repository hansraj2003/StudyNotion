import { Course } from "../models/Course.models.js";
import { Category } from "../models/Category.models.js";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import { uploadImage } from "../utils/cloudinary.js";

// Create Course
const createCourse = asyncHandler(async(req, res) => {
    // fetch Data
    const {courseName, price, thumbnail, category, whatYouWillLearn} = req.body

    const thumbnailImage = req.files?.thumbnail;

    // validate

    if(!(courseName || price || thumbnail || category || whatYouWillLearn || thumbnailImage)) {
        throw new ApiError(401, "All fields are requied")
    }

    // Check category is valid or not

    const CategoryDetails = await Category.findById(category).select("-description -course")

    if(!CategoryDetails) {
        throw new ApiError(401, "Category Details not found")
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
        category,
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
    await Category.findByIdAndUpdate(
        CategoryDetails?._id,
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
    const courseDetails = await Course.find().select("-courseDescription -whatYouWillLearn -courseContent -category").populate("Instructor").exec();

    if(!courseDetails) {
        throw new ApiError(500, "Error while fetching course details");
    }

    return res.status(200).json(
        new ApiResponse(200, courseDetails, "Course Details Recieved Successfully")
    )
})

// get course details
const getCourseDetails = asyncHandler(async (req, res) => {
    // get courseId
    const {courseId} = req.body

    // validate
    if(!courseId) {
        throw new ApiError(500, "Course ID is not present", error?.message)
    }

    // fetch courseDetails
    const courseDetails = await Course.findById(courseId)
    .populate(
        {
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        },
    )
    .populate("category")
    .populate("ratingAndReviews")
    .populate(
        {
            path: "courseContent",
            populate: {
                path: "Subsection",
            },
        },
    )
    .exec()

    if(!courseDetails) {
        throw new ApiError(500, "Course Details Not Found", error?.message)
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, courseDetails, "Course Details Fetched Successfully")
    )
})

export {
    createCourse,
    allCourses,
    getCourseDetails,
}