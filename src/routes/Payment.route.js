import { Router } from "express";
import { capturePayment, verifySignature } from "../controllers/Payements.js";
import { auth, isStudent } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/capture-payment", auth, isStudent, capturePayment)
router.post("/verify-signature", auth, isStudent, verifySignature)

export default router;