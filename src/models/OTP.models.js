import mongoose, {mongo, Schema} from "mongoose";

const OTPSchema = new Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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

export const OTP = mongoose.model("OTP", OTPSchema)