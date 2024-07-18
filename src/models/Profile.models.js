import mongoose, {Schema} from "mongoose";

const profileSchema = new Schema({

    gender: {
        type: String,
        enum: ["Male","Female","Others"],
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
        index: true,
        unique: true,
        required: true,
    }

}, {
    timestamps: true,
})

export const Profile = mongoose.model("Profile", profileSchema)