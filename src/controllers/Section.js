import { User } from "../models/User.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Section } from "../models/Section.models";
import { Course } from "../models/Course.models";
import { ApiResponse } from "../utils/ApiResponse";


// create Section
const section = asyncHandler(async(req, res) => {
    try {
        // fetch data from req body
        const {sectionName, courseId} = req.body
    
        // validate
        if(!(sectionName || courseId)) {
            throw new ApiError(401, "All fields are required")
        }
    
        // section create
        const newSection = await Section.create({
            sectionName: sectionName,
        })
    
        // update section in Course Schehma
        const updateSectionInCourseSchema = await Course.findByIdAndUpdate(courseId, 
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true}                                                     /* Populate this with section and subsection while testing */
        )
    
        // return res
        return res.status(200).json(
            new ApiResponse(200, {
                user: updateSectionInCourseSchema, newSection,
            }, "Section Created Successfully")
        )
    } catch (error) {
        console.log("Error while creating section", error);
        throw new ApiError(500, "Error while creating section", error.message)
    }
})

// Update Section
const updateSection = asyncHandler(async(req, res) => {
    try {
        const {sectionName, sectionId} = req.body
    
        if(!(sectionName || sectionId)) {
            throw new ApiError(401, "Missing Properties")
        }
    
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $set: {
                    sectionName: sectionName,
                }
            },
            {new: true}
        )
    
        return res.status(200).josn(
            new ApiResponse(200, updatedSection, "Section Updated Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while updating Section", error?.message)
    }

})

// Delete Section
const deleteSection = asyncHandler(async(req, res) => {
    try {
        // fetching data = assuming we are sending Id in paras
        const {sectionId} = req.params
    
        if(!sectionId) {
            throw new ApiError(401, "Missing Properties")
        }
    
        const deletedSection = await Section.findByIdAndDelete(sectionId)

        // Do we need to delete sectionId from course schema
    
        return res.status(200).json(
            new ApiResponse(200, deletedSection, "Section Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting Section", error)
    }
})

export {
    section,
    updateSection,
    deleteSection,
}