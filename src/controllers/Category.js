import { Category } from "../models/Category.models.js";
import { Course } from "../models/Course.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

//Create Category
const category = asyncHandler(async (req, res) => {
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

// categoryPageDetails
const categoryPageDetails = asyncHandler(async (req, res) => {
    // get categoryId
    const {categoryId} = req.body

    // get courses from specified categoryId
    const selectedCategory = await Category.findById(categoryId).populate("course").exec()

    if(!selectedCategory) {
        throw new ApiError(404, "Category Not Found", error?.message)
    }

    // get course for different categories
    const courseForDifferentCategory =  await Category.findById(
        {
            $ne:{_id: categoryId},
        }
    ).populate("courses").exec()

    // get top selling courses
    const topSellingCourse = await Course.find({}).sort({studentsEnrolled: "desc"})


    return res.status(200).json(
        new ApiResponse(200, 
            {
                selectedCategory: selectedCategory,
                courseForDifferentCategory: courseForDifferentCategory,
                topSellingCourse: topSellingCourse,
            },
            "All courses of particular category fetched successfully"
        )
    )
})

export {
    category,
    showAllCategory,
    categoryPageDetails,
}