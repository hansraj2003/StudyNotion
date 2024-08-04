import connectDB from "./config/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";
import { cloudinaryConnect } from "./config/cloudinary.js";

dotenv.config();

// ************************************************* DB CONNECTION ***********************************************
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`DataBase Connection Failed: `, err);
})

// ************************************************* CLOUDINARY CONNECTION ***********************************************
cloudinaryConnect()
.then(() => {
    console.log(`Cloudinary connection successfull`);
})
.catch((err) => {
    console.log(`Cloudinary connection failed`, err);
    
})