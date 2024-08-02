import { sendOTP, signUp, login, changePassword } from "../controllers/Auth.js";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword.js";
import { auth } from "../middlewares/auth.middleware.js";

import { Router } from "express";

const router = Router()
// **********************************************************************************************************
//                                      Authentication Routes
// **********************************************************************************************************

// Route for user signup
router.route("/signup").post(signUp)

// Route for sending otp
router.route("/sendotp").post(sendOTP)

// Route for login
router.route("/login").post(login)
        
// **********************************************************************************************************
//                              Secured Routes and Rotes for Reset Passsword
// **********************************************************************************************************

// Route for changing password
router.route("/change-password").put(auth ,changePassword)

// Route for resetPassword
router.route("/reset-password").post(resetPassword)

// Route for reset password token
router.route("/reset-password-token").post(resetPasswordToken)

export default router;