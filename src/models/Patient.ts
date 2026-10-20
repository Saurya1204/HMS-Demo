import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  village?: string;
  tokenQr: string;
  source: "Direct" | "AMMA_Clinic";
  urgency: "Routine" | "Urgent" | "Critical";
  status:
    | "Referred_AMMA"
    | "Reception_Waiting"
    | "In_Consultation"
    | "Admitted_IPD"
    | "Discharged";
  vitals: {
    bp: string;
    spo2: number;
    pulse: number;
    temp?: number;
  };
  symptoms: string[];
  fastAssessment?: {
    faceDroop: boolean;
    armWeakness: boolean;
    slurredSpeech: boolean;
    timeToActHours?: number;
  };
  notes?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedBedId?: string;
  assignedBedNumber?: string;
  assignedWard?: string;
}

const PatientSchema = new Schema<IPatient>(
  {
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: { type: String, required: true },
    village: { type: String },
    tokenQr: { type: String, required: true },
    source: { type: String, enum: ["Direct", "AMMA_Clinic"], required: true },
    urgency: {
      type: String,
      enum: ["Routine", "Urgent", "Critical"],
      default: "Routine",
    },
    status: {
      type: String,
      enum: [
        "Referred_AMMA",
        "Reception_Waiting",
        "In_Consultation",
        "Admitted_IPD",
        "Discharged",
      ],
      default: "Reception_Waiting",
    },
    vitals: {
      bp: { type: String, required: true },
      spo2: { type: Number, required: true },
      pulse: { type: Number, required: true },
      temp: { type: Number },
    },
    symptoms: [{ type: String }],
    fastAssessment: {
      faceDroop: { type: Boolean, default: false },
      armWeakness: { type: Boolean, default: false },
      slurredSpeech: { type: Boolean, default: false },
      timeToActHours: { type: Number },
    },
    notes: { type: String },
    assignedDoctorId: { type: String },
    assignedDoctorName: { type: String },
    assignedBedId: { type: String },
    assignedBedNumber: { type: String },
    assignedWard: { type: String },
  },
  { timestamps: true }
);

export const PatientModel =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
