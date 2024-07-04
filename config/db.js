import mongoose from 'mongoose';
import {DB_NAME} from '../utils/constants.js';

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
       console.log(`\n MONGODB CONNECTED !! DB HOST ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB Connection failed" , error);
        process.exit(1);
    }
}

export default connectDB;