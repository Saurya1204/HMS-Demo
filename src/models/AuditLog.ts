import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  id: string;
  action: string;
  actor: string;
  module: "AMMA" | "Reception" | "Doctor" | "BedBoard" | "MNSRI" | "Admin" | "Appointments";
  details: string;
  recordRef?: string;
  outcome?: "Success" | "Failed" | "Pending";
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    id: { type: String, required: true },
    action: { type: String, required: true },
    actor: { type: String, required: true },
    module: {
      type: String,
      enum: ["AMMA", "Reception", "Doctor", "BedBoard", "MNSRI", "Admin", "Appointments"],
      required: true,
    },
    details: { type: String, required: true },
    recordRef: { type: String },
    outcome: { type: String, enum: ["Success", "Failed", "Pending"], default: "Success" },
  },
  { timestamps: true }
);

export const AuditLogModel =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
