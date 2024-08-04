import mongoose, {mongo, Schema} from "mongoose";
// import ApiError from "../utils/ApiError.js"
import { ApiError } from "../utils/ApiError.js";
import { mailSender } from "../utils/mailSender.js";

const OTPSchema = new Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        // unique: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires:5*60,
    }

},{
    timestamps: true,
})

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email From StudyNotion",
            otp
        )
        console.log("OTP in email sent Successfully!", mailResponse);
    } catch (error) {
        
        console.log("Error while sending otp in email", error);
        throw new ApiError(500, "Error while sending otp in email", error);
    }
}

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(
        this.email,
        this.otp
    );
    next();
})

export const OTP = mongoose.model("OTP", OTPSchema)