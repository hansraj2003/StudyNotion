import { Section } from "../models/Section.models.js";
import { Subsection } from "../models/Subsection.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";



// Create Subsection
const subSection = asyncHandler(async(req, res) => {
    try {
        // fetch data from req body
        const {title, timeDuration, description, sectionId} = req.body
    
        // fetch video from req files
        const video = req.files?.videoFile

        // validate it
        if(!(title || timeDuration || description || video)) {
            throw new ApiError(403, "All fields are Required")
        }
    
        if(!sectionId) {
            throw new ApiError(403, "Missing Properties")
        }

        // upload video on cloudinary
        const videoUploaded = await uploadImage(video, process.env.CLOUDINARY_FOLDER_NAME)
    
        // create subSection
        const newSubSection = await Subsection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: videoUploaded?.url,
        })
    
        // update subSection Id in section schema
        const updateSubsectionIdInSectionSchema = await Section.findByIdAndUpdate(sectionId, 
            {
                $push: {
                    Subsection: newSubSection._id,
                }
            },
            {new: true}
        ).populate("Subsection")                                                     /* As section schema contains subsection id, so to log whole subsection in section schema we need to populate it */ 
        console.log("updated Subsection Id In Section Schema: ". updateSubsectionIdInSectionSchema);
    
        // return res
        res.status(200).json(
            new ApiResponse(200, newSubSection, "New Subsection created Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error while creating new subsection", error)
    }
})

// Update Subsection
const updateSubsection = asyncHandler(async(req, res) => {
    const {title, timeDuration, description, subSectionId} = req.body
    
        // fetch video from req files
        const video = req.files?.videoFile

        // validate it
        if(!(title || timeDuration || description || video)) {
            throw new ApiError(403, "All fields are Required")
        }
    
        if(!subSectionId) {
            throw new ApiError(403, "Missing Properties")
        }
    
        // upload video on cloudinary
        const videoUploaded = await uploadImage(video, process.env.CLOUDINARY_FOLDER_NAME)

        // update Subsection
        const updatedSubsection = await Subsection.findByIdAndUpdate(
            subSectionId,
            {
                $set: {
                    title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: videoUploaded?.url,
                }
            },
            {new: true}
        )
    
        // return res
        return res.status(200).josn(
            new ApiResponse(200, updatedSubsection, "Section Updated Successfully")
        )
})

// Delete Subsection
const deleteSubsection = asyncHandler(async(req, res) => {
    const {subSectionId} = req.params

    if(!subSectionId) {
        throw new ApiError(401, "Missing subsectionId")
    }

    const deleteSubsection = await Subsection.findByIdAndDelete(subSectionId)

    return res.status(200).json(
        new ApiResponse(200, deleteSubsection ,"Subsection Deleted Successfully")
    )
})

export {
    subSection,
    updateSubsection,
    deleteSubsection,
}