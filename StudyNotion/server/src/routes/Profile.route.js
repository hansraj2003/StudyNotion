import { Router } from "express";
import { profile, deleteAccount, getAllUserDetails } from "../controllers/Profile.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router()
// **********************************************************************************************************
//                                           Profile Routes
// **********************************************************************************************************

// Route for creating profile
router.post("/profile", auth, profile)

// Route for deleting account
router.delete("/delete-account", auth, deleteAccount)

// Route for getting all user details
router.get("/getUserDetails",auth, getAllUserDetails)

export default router;