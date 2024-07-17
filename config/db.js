import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MONGODB connected Successfully!! ${connectionInstance}\n${DB_NAME}`);
    } catch (error) {
        console.log("ConnectDB Error: ", error);
        process.exit(1);
    }
}

export default connectDB;