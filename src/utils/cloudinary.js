import {v2 as cloudinary} from "cloudinary"

const uploadImage = async(files, folder, height, quality) => {

    const options = {folder}
    console.log("Options in cloudinary: ", options);

    if(height) {
        options.height = height
    }

    if(quality) {
        options.quality = quality
    }

    return await cloudinary.uploader.upload(file.tempfilepath, options)


}

export {
    uploadImage
}