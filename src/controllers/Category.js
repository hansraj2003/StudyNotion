import { Category } from "../models/Category.models";
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler"

//Create Category
const Category = asyncHandler(async (req, res) => {
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
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log("Category Details are: ", CategoryDetails);
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, CategoryDetails,"Category Created Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error while creating Category", error)
    }
})

// Show All Category
const showAllCategory = asyncHandler(async(req, res) => {
    try {

        const allCategory = await Category.findOne({}, {
            name: true,
            description: true,
        })

        if(!allCategory) {
            throw new ApiError(500, "Category cannot be loaded")
        }

        return res.status(200).json(
            new ApiResponse(200, allCategory, "Category loaded successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Eror while showing all the Category", error)
    }
})

export {
    Category,

}