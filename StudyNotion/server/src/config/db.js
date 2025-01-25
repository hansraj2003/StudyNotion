import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MONGODB connected Successfully!! ${connectionInstance}\n${DB_NAME}`);
    } catch (error) {
        console.log("ConnectDB Error: ", error);
        process.exit(1);
    }
}

export default connectDB;