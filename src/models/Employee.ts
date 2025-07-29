import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  terminationDate?: Date;
  isActive: boolean;
}

const EmployeeSchema = new Schema<IEmployee>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  hireDate: { type: Date, default: Date.now },
  terminationDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);