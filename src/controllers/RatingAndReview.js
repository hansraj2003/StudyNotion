import { Course } from "../models/Course.models"
import { RatingAndReviews } from "../models/RatingAndReviews.models"
import { User } from "../models/User.models"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import {asyncHandler} from "../utils/asyncHandler"



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