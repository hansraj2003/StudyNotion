import nodemailer from "nodemailer"
import { ApiError } from "./ApiError.js"

const mailSender =  async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        const info = await transporter.sendMail({
            from:'StudyNotion',
            to: `${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

        console.log(info);

        return info;
    } catch (error) {
        throw new ApiError(500, "Error Occured While Genreating OTP!", error);
    }
}

export {mailSender}