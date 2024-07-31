import mongoose from "mongoose";
import { instance } from "../config/razorpay";
import { Course } from "../models/Course.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/User.models";
import { mailSender } from "../utils/mailSender";
import { courseEnrollmentEmail } from "../mailTemplates/courseEnrollmentEmail";


const capturePayment = asyncHandler(async (req, res) => {
    // get courseId and UserId
    const {courseId} = req.body
    const userId = req.user.id

    // validate courseId and UserId
    if(!courseId) {
        throw new ApiError(401, "Please Provide valid course Id")
    }

    if(!userId) {
        throw new ApiError(401, "Unauthorised Request")
    }

    // valid Course Details
    let course;
    try {
        course = await Course.findById(courseId)
        if(!course) {
            throw new ApiError(500, "Course Not Found")
        }

        // user already paid for the same course
        const uid = new mongoose.Types.ObjectId(userId)                 /* As userId is in format of string and userId stored in course.studentsEmrolled is in form of Object */

        if(course.studentsEnrolled.includes(uid)) {
            new ApiResponse(200, null, "Student already enrolled in a course") 
        }


    } catch (error) {
        throw new ApiError(500, "Error occured while fetching Course Details", error)
    }
    
    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            course: courseId,
            userId,
        }
    }

    try {
        // initiate the payment using razorpay
        const paymentResponse = await instance.create.orders(options)

        // return res
        return res.status(200).json(
            new ApiResponse(200, 
                {
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    thumbnail: course.thumbnail,
                    amount: paymentResponse.amount,
                    currency: paymentResponse.currency,
                    orderId: paymentResponse.id,
                },
                "Payment Successful!"
            )
        )

    } catch (error) {
        throw new ApiError(401, "Could not initiate payment", error)
    }
})

const verifySignature = asyncHandler(async(req, res) => {
    const webHookSecret = '123456789'

    const signature = req.header["x-razorpay-signature"]

    const shasum = crypto.createHmac("sha256", webHookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex")

    console.log(`Shasum: ${shasum} and digest: ${digest} ans signature: ${signature}`);

    if(signature === digest) {
        console.log("Payment is Autorised");

        const {courseID, userId} = req.body.payload.payment.entity.notes

        try {
            // if(!courseID) {
            //     throw new ApiError(500, "CourseId is missing", error?.message)
            // }
    
            // if(!userId) {
            //     throw new ApiError(500, "UserId is missing", error?.message)
            // }
    
            const course = await Course.findByIdAndUpdate(courseID, 
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                {new: true}
            )
    
            if(!course) {
                throw new ApiError(500, "Course not found", error?.message)
            }
    
            const user = await User.findByIdAndUpdate(userId, 
                {
                    $push: {
                        courses: courseID,
                    }
                }
            )
            
            if(!user) {
                throw new ApiError(500, "User not found", error?.message)
            }

            // mail send
            const mailResponse = await mailSender(user.email, "Congratulations, you are onboarded into new Course", courseEnrollmentEmail(course.courseName, `${user.firstName} ${user.lastName}`))

            if(!mailResponse) {
                throw new ApiError(500, "Error occured while sending mail", error?.message)
            }

            return res.status(200).json(
                new ApiResponse(200,
                    {
                        request: req,
                        course: course,
                        user: user,
                        mailResponse: mailResponse,
                    },
                    "Signature Verified, Course Added and Mail sent to user successfully"
                )
            )
    
        } catch (error) {
            throw new ApiError(500, "Error in verifySignature", error)
        }
    } else {
        throw new ApiError(400, "Unauthorised Request", error?.message)
    }
})

export {
    capturePayment,
    verifySignature,
}