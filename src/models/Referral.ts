import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
  id: string;
  referralNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  village: string;
  source: "Direct" | "AMMA_Clinic" | "Peripheral_PHC";
  urgency: "Routine" | "Urgent" | "Critical";
  symptoms: string[];
  vitals: {
    bp: string;
    spo2: number;
    pulse: number;
    temp?: number;
  };
  status: "Pending_Arrival" | "Arrived" | "OPD_Registered" | "Admitted_IPD";
  arrivalTime?: string;
  notes?: string;
}

const ReferralSchema = new Schema<IReferral>(
  {
    id: { type: String, required: true, unique: true },
    referralNumber: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: { type: String, required: true },
    village: { type: String, default: "Maharajganj Outreach" },
    source: {
      type: String,
      enum: ["Direct", "AMMA_Clinic", "Peripheral_PHC"],
      required: true,
      default: "AMMA_Clinic",
    },
    urgency: {
      type: String,
      enum: ["Routine", "Urgent", "Critical"],
      default: "Routine",
    },
    symptoms: [{ type: String }],
    vitals: {
      bp: { type: String, required: true },
      spo2: { type: Number, required: true },
      pulse: { type: Number, required: true },
      temp: { type: Number },
    },
    status: {
      type: String,
      enum: ["Pending_Arrival", "Arrived", "OPD_Registered", "Admitted_IPD"],
      default: "Pending_Arrival",
    },
    arrivalTime: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const ReferralModel =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema);
