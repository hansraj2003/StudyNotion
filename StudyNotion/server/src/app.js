import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoutes from "./routes/User.route.js"
import profileRoutes from "./routes/Profile.route.js"
import courseRoutes from "./routes/Course.route.js"
import paymentRoutes from "./routes/Payment.route.js"
import contactUsRoutes from "./routes/ContactUs.route.js"
import fileUpload from "express-fileupload"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json());
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp"
    })
)

// routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/contactUs", contactUsRoutes)

// default route
app.get("/", () => {
    return res.json({
        success: true,
        message: "Your server is up and running"
    })
})

export {app};