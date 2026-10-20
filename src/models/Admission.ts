import mongoose, { Schema, Document } from "mongoose";

export interface IAdmission extends Document {
  id: string;
  admissionNumber: string;
  patientId: string;
  patientName: string;
  bedId: string;
  bedNumber: string;
  wardName: "Stroke ICU" | "Neuro Recovery" | "General Male" | "General Female";
  admittingDoctor: string;
  diagnosis: string;
  admissionDate: string;
  dischargeDate?: string;
  status: "Admitted" | "Transferred" | "Discharged";
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    id: { type: String, required: true, unique: true },
    admissionNumber: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    bedId: { type: String, required: true },
    bedNumber: { type: String, required: true },
    wardName: {
      type: String,
      enum: ["Stroke ICU", "Neuro Recovery", "General Male", "General Female"],
      required: true,
    },
    admittingDoctor: { type: String, required: true },
    diagnosis: { type: String, required: true },
    admissionDate: { type: String, required: true },
    dischargeDate: { type: String },
    status: {
      type: String,
      enum: ["Admitted", "Transferred", "Discharged"],
      default: "Admitted",
    },
  },
  { timestamps: true }
);

export const AdmissionModel =
  mongoose.models.Admission ||
  mongoose.model<IAdmission>("Admission", AdmissionSchema);
