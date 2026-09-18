import mongoose from "mongoose";
const dbConection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/saraha-app')
        console.log('database connect succses');

    } catch (error) {
        console.error('database connection failed', error);

    }

}
export default dbConection;