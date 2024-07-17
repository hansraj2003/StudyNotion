import connectDB from "./config/db.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const app = express();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`DataBase Connection Failed: `, err);
})