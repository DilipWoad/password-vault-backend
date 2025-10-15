import mongoose from "mongoose"
const connectDb = async ()=>{
    try {
        const mongooseInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected Successfully!!",mongooseInstance.connection.host)
    } catch (error) {
        console.error("Error while connecting mongoose with mongodb : ",error.message)
        process.exit(1)
    }
}   
export default connectDb;