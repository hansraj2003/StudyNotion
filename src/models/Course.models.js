import mongoose, {Schema} from "mongoose";

const courseSchema = new Schema({

    courseName: {
        type:  String,
        required: true,
        index: true,
    },
    courseDescription: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    Instructor: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseContent: [{
        type: mongoose.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReviews: [{
        type: mongoose.Types.ObjectId,
        ref: "RatingAndReviews",
    }],
    price: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    tag: {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
    },
    studentsEnrolled: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }

},{
    timestamps: true,
})

export const Course = mongoose.model("Course", courseSchema)