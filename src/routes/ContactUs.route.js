import { Router } from "express";
import { contactUs } from "../controllers/ContactUs.js";

const router = Router()

router.route("/contact-us", auth, contactUs)

export default router;