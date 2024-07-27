import mongoose, {mongo, Schema} from "mongoose";

const categorySchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    course: [{
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
    }]

},{
    timestamps: true,
})

export const Category = mongoose.model("Category", categorySchema)