import mongoose, {mongo, Schema} from "mongoose";

const ratingAndReviewsSchema = new Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: {
        type: String,
        required: true,
    }

},{
    timestamps: true,
})

export const RatingAndReviews = mongoose.model("RatingAndReviews", ratingAndReviewsSchema)