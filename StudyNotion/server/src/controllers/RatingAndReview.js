import mongoose from "mongoose"
import { Course } from "../models/Course.models.js"
import { RatingAndReviews } from "../models/RatingAndReviews.models.js"
import { User } from "../models/User.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



// create Rating and Reviews
const createRatingAndReviews = asyncHandler( async (req, res) => {
    // fetch courseId and rating and reviews
    const {rating, reviews, courseId} = req.body

    // get user id
    const userId = req.user.userId

    // validate
    if(!(rating || reviews)) {
        throw new ApiError(401, "Rating and Reviews are must.", error?.message)
    }

    if(!courseId) {
        throw new ApiError(500, "Course Id not found", error?.message)
    }

    if(!userId) {
        throw new ApiError(500, "User Id not found", error?.message)
    }

    // check if user bought the course
    // const user = await User.findById(userId)

    const course = await Course.findOne(
        {
            _id: courseId, 
            studentsEnrolled: {
                elemMatch: {$eq: userId},
            },
        }
    )

    // if(!user) {
    //     throw new ApiError(500, "User not found", error?.message)
    // }

    if(!course) {
        throw new ApiError(404, "User did not enroll in this  course", error?.message)
    }

    // if(!user.courses.find(courseId)) {
    //     throw new ApiError(500, "User did not buy the course")
    // }

    // check if user already rated and reviewed course
    const alreadyReviewed = await RatingAndReviews.findOne(
        {
            user: userId,
            course: courseId,
        }
    ) 
    if(alreadyReviewed) {
        throw new ApiError(401, "User already reviewed for Course", error?.message)
    }

    // created rating and reviews
    const createdRatingAndReviews = await RatingAndReviews.create({
        user: userId,
        rating: rating,
        reviews: reviews,
        course: courseId,
    })

    // update course with this rating and reviews
    try {
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push:{
                ratingAndReviews: createdRatingAndReviews._id,
            }
        }, {new: true})
    } catch (error) {
        throw new  ApiError(500, "Could not update rating and reviews in course", error)
    }
    // return res
    return res.status(200).json(
        new ApiResponse(200, {createdRatingAndReviews, updatedCourse }, "Reviews and Rating Created Successfully")
    )
})

// get average rating
const getAverageRating = asyncHandler(async (req, res) => {
    // get courseId
    const courseId = req.body.courseId

    // calculate ratings
    const result = await RatingAndReviews.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating"}
            }
        }
    ])
    // return ratings
    if(result.length > 0) {
        new ApiResponse(200, 
            {
                averageRating: result[0].averageRating,
                result: result,
            },
            "Average Ratings calculated successfully"
        )
    }

    // if not ratings
    new ApiResponse(200,
        {
            averageRating: 0,
        },
        "No User rated this course",
    )
})

// get all ratings
const getAllRating = asyncHandler( async (req, res) => {
    // const userId = req.user.id

    const allRatings = await RatingAndReviews.find(
        {
            // $match: {
            //     user: new mongoose.Types.ObjectId(userId),
            // }
        }
    ).sort({rating: "desc"})
    .populate(
        {
            $path: "course",
            select: "courseName"
        }
    ).populate(
        {
            $path: "user",
            select: "firstName lastName email image"
        }
    )
    .exec()

    if(!allRatings) {
        throw new ApiError(500, "User has not rated and reviews the course yet", error?.message)
    }

    return res.status(200).json(
        new ApiResponse(200,
            {
                allRatings: allRatings,
            },
            "User ratings and reviews fetched successfully"
        )
    )
})

export {
    createRatingAndReviews,
    getAverageRating,
    getAllRating,
}