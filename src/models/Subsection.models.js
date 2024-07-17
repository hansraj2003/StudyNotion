import mongoose, {Schema} from "mongoose";

const subsectionSchema = Schema({

    title: {
        type: String,
        required: true,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
        unique: true,
    }

},{
    timestamps: true,
})

export const Subsection = mongoose.model("Subsection", subsectionSchema)