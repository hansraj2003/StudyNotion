import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
    },
    accountType: {
        type: String,
        enum: ["Student", "Instructor", "Admin"],
        required: true,
    },
    additionalDetails: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
    }],
    image: {
        type: String,
        required: true,
    },
    courseProgress: {
        type: Schema.Types.ObjectId,
        ref: "courseProgress",
    },
},{
    timestamps: true
})

export const User = mongoose.model("User", userSchema);