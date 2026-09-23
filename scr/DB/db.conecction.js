import mongoose from "mongoose";
import envConfig from "../config/env.config.js";
const dbConection = async () => {
    try {
        await mongoose.connect(envConfig.dataBase.URI)
        console.log('database connect succses');

    } catch (error) {
        console.error('database connection failed', error);

    }

}
export default dbConection;