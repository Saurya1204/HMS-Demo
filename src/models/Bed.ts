import mongoose, { Schema, Document } from "mongoose";

export interface IBed extends Document {
  bedNumber: string;
  wardName: "Stroke ICU" | "Neuro Recovery" | "General Male" | "General Female";
  status: "available" | "occupied" | "maintenance" | "cleaning";
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientAge?: number;
  currentPatientGender?: string;
  admittedDiagnosis?: string;
  assignedDoctor?: string;
  admissionDate?: Date;
  notes?: string;
}

const BedSchema = new Schema<IBed>(
  {
    bedNumber: { type: String, required: true, unique: true },
    wardName: {
      type: String,
      enum: ["Stroke ICU", "Neuro Recovery", "General Male", "General Female"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "cleaning"],
      default: "available",
    },
    currentPatientId: { type: String },
    currentPatientName: { type: String },
    currentPatientAge: { type: Number },
    currentPatientGender: { type: String },
    admittedDiagnosis: { type: String },
    assignedDoctor: { type: String },
    admissionDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export const BedModel =
  mongoose.models.Bed || mongoose.model<IBed>("Bed", BedSchema);
