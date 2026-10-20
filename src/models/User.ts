import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: "receptionist" | "doctor" | "nurse" | "researcher" | "admin" | "patient";
  department?: string;
  avatarUrl?: string;
  active?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["receptionist", "doctor", "nurse", "researcher", "admin", "patient"],
      required: true,
    },
    department: { type: String },
    avatarUrl: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
