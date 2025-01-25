import { Router } from "express";
import { contactUs } from "../controllers/ContactUs.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/contact-us", auth, contactUs)

export default router;