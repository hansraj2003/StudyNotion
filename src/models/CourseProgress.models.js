import mongoose, {Schema} from "mongoose";

const courseProgessSchema = new Schema({

    courseID: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    completedVideos: {
        type: mongoose.Types.ObjectId,
        ref: "Subsection",
    }

}, {
    timestamps: true,
})

export const CourseProgress = mongoose.model("CourseProgress", courseProgessSchema)