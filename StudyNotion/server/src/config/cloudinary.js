import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const cloudinaryConnect = async(req, res) => {
    try {
        cloudinary.config(
            {
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            }
        )
    } catch (error) {
        throw new ApiError(500, "Cloudinary cannot be configured", error)
    }
}

export {
    cloudinaryConnect,
}