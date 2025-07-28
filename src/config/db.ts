import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(
      colors.cyan.underline.bold(`MongoDB Connected: ${conn.connection.host}`)
    );
  } catch (error: any) {
    console.error(colors.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
