import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Database connected successfully`);
    return conn;
  } catch (error) {
    console.error(`Error while connecting to database ${error.message}`);
  }
};

export default connectDB; 
