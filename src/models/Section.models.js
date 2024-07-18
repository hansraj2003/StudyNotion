import mongoose, {Schema} from "mongoose";
import { Subsection } from "./Subsection.models";

const sectionSchema = new Schema({

    sectionName: {
        type: String,
    },
    Subsection: [{
        type: mongoose.Types.ObjectId,
        ref: "Subsection",
        required: true,
    }]

},{
    timestamps: true,
})

export const Section = mongoose.model("Section", sectionSchema)