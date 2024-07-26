import { Tags } from "../models/Tags.models";
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler"

//Create Tag
const Tag = asyncHandler(async (req, res) => {
    try {
        // fetch data from req body
        const {name, description} = req.body
    
        // validate data
        if(!(name || description)) {
            throw new ApiError(401, "All fields are required");
        }
    
        if(name.trim() == "" || description.trim() == "") {
            throw new ApiError(401, "All fields are required");
        }
    
        // create entry in DB
        const tagDetails = await Tags.create({
            name: name,
            description: description,
        })
        console.log("Tag Details are: ", tagDetails);
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, tagDetails,"Tag Created Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error while creating Tag", error)
    }
})

// Show All Tags
const showAllTags = asyncHandler(async(req, res) => {
    try {

        const allTags = await Tags.findOne({}, {
            name: true,
            description: true,
        })

        if(!allTags) {
            throw new ApiError(500, "Tags cannot be loaded")
        }

        return res.status(200).json(
            new ApiResponse(200, allTags, "Tags loaded successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Eror while showing all the tags", error)
    }
})

export {
    Tag,

}