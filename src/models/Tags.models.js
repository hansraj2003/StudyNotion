import mongoose, {mongo, Schema} from "mongoose";

const tagsSchema = new Schema({

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

export const Tags = mongoose.model("Tags", tagsSchema)