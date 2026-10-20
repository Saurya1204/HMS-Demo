import mongoose, { Schema, Document } from "mongoose";

export interface IEncounter extends Document {
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  type: "OPD" | "IPD";
  status: "Draft" | "Completed" | "Admitted";
  vitals: {
    bp: string;
    spo2: number;
    pulse: number;
    temp?: number;
  };
  diagnosis: string;
  icdCodes: string[];
  prescriptions: {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  labOrders: string[];
  clinicalNotes: string;
  bedAdmissionOrdered?: boolean;
  admittedWard?: string;
  admittedBedNumber?: string;
}

const EncounterSchema = new Schema<IEncounter>(
  {
    patientId: { type: String, required: true },
    patientName: { type: String },
    doctorId: { type: String, required: true },
    doctorName: { type: String },
    type: { type: String, enum: ["OPD", "IPD"], default: "OPD" },
    status: {
      type: String,
      enum: ["Draft", "Completed", "Admitted"],
      default: "Completed",
    },
    vitals: {
      bp: { type: String, required: true },
      spo2: { type: Number, required: true },
      pulse: { type: Number, required: true },
      temp: { type: Number },
    },
    diagnosis: { type: String, required: true },
    icdCodes: [{ type: String }],
    prescriptions: [
      {
        medicine: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String },
      },
    ],
    labOrders: [{ type: String }],
    clinicalNotes: { type: String },
    bedAdmissionOrdered: { type: Boolean, default: false },
    admittedWard: { type: String },
    admittedBedNumber: { type: String },
  },
  { timestamps: true }
);

export const EncounterModel =
  mongoose.models.Encounter ||
  mongoose.model<IEncounter>("Encounter", EncounterSchema);
