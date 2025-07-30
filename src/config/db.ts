import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  // Skip connection in test environment (jest handles it)
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
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
