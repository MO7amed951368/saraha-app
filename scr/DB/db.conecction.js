import mongoose from "mongoose";
import { dbConfig } from "../config/db.config.js";
const dbConection = async () => {
    try {
        console.log(dbConfig);
        await mongoose.connect(dbConfig)
        console.log('database connect succses');

    } catch (error) {
        console.error('database connection failed', error);

    }

}
export default dbConection;