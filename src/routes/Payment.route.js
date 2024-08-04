import { Router } from "express";
import { capturePayment, verifySignature } from "../controllers/Payements.js";
import { auth, isStudent } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", auth, isStudent, verifySignature)

export default router;