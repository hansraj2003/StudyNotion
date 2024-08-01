import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { mailSender } from "../utils/mailSender";



// Contact Us
const contactUs = asyncHandler(async (req, res) => {
    // fetch details
    const {firstName, lastName, email, phoneNumber, message} = req.body
    const userId = req.user.id

    // validate
    if(!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !message.trim()) {
        throw new ApiError(401, "All input fields are required")
    }

    // send mail to studyNotion
    const mailToStudyNotion = await mailSender(process.env.MAIL_HOST, `A mail from ${firstName} ${lastName}`, `A StudyNotion user has sent a following message: \n ${message} \n Email of User is ${email}`) 

    if(!mailToStudyNotion) {
        throw new ApiError(500, "Error while sending mail to StudyNotion",error?.message)
    }

    // send mail to user
    const responseEmailToUser = await mailSender(email, `Your mail has reached studyNotion`, `Thanks, ${firstName} ${lastName} for contacting us. Our officials we get back to you once they receive it.`)

    if(!responseEmail) {
        throw new ApiError(500, `Error while sending mail to user named ${firstName} ${lastName}`,error?.message)
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, 
            {
                mailToStudyNotion: mailToStudyNotion,
                responseEmailToUser: responseEmailToUser,
            },
            "Mail Sent to both StudyNotion and User successfully",
        )
    )
})