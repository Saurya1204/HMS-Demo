import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  id: string;
  patientId?: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  contact: string;
  department: string;
  doctorName: string;
  date: string;
  slot: string;
  reason: string;
  status: "Scheduled" | "Checked_In" | "Completed" | "Cancelled";
  tokenNumber: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: { type: String, required: true },
    department: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    reason: { type: String, default: "General Consultation" },
    status: {
      type: String,
      enum: ["Scheduled", "Checked_In", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    tokenNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const AppointmentModel =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
