import mongoose, { Schema, Document } from "mongoose";

export interface IPublication extends Document {
  id: string;
  projectId?: string;
  title: string;
  abstract?: string;
  authors: string;
  journal: string;
  status: "Draft" | "Under Review" | "Approved" | "Published" | "Rejected";
  date: string;
  submittedBy?: string;
  documentRef?: string;
}

const PublicationSchema = new Schema<IPublication>(
  {
    id: { type: String, required: true, unique: true },
    projectId: { type: String },
    title: { type: String, required: true },
    abstract: { type: String },
    authors: { type: String, required: true },
    journal: { type: String, required: true },
    status: {
      type: String,
      enum: ["Draft", "Under Review", "Approved", "Published", "Rejected"],
      default: "Draft",
    },
    date: { type: String, required: true },
    submittedBy: { type: String },
    documentRef: { type: String },
  },
  { timestamps: true }
);

export const PublicationModel =
  mongoose.models.Publication ||
  mongoose.model<IPublication>("Publication", PublicationSchema);
