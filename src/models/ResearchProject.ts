import mongoose, { Schema, Document } from "mongoose";

export interface IResearchProject extends Document {
  projectCode: string;
  title: string;
  leadInvestigator: string;
  leadInvestigatorRole: string;
  category: "Stroke Recovery" | "Neuroplasticity" | "Endovascular AI" | "Tele-Neuro";
  description: string;
  cohortSize: {
    enrolled: number;
    target: number;
  };
  milestones: {
    id: string;
    title: string;
    status: "Pending" | "In_Progress" | "Completed";
    targetDate: string;
    completedDate?: string;
    description?: string;
  }[];
  publications: {
    id: string;
    title: string;
    authors: string;
    journal: string;
    status: "Draft" | "Under Review" | "Approved" | "Published";
    date: string;
  }[];
  status: "Active" | "Recruiting" | "Completed" | "Review";
}

const ResearchProjectSchema = new Schema<IResearchProject>(
  {
    projectCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    leadInvestigator: { type: String, required: true },
    leadInvestigatorRole: { type: String, default: "Principal Investigator" },
    category: {
      type: String,
      enum: ["Stroke Recovery", "Neuroplasticity", "Endovascular AI", "Tele-Neuro"],
      required: true,
    },
    description: { type: String, required: true },
    cohortSize: {
      enrolled: { type: Number, default: 0 },
      target: { type: Number, default: 100 },
    },
    milestones: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        status: {
          type: String,
          enum: ["Pending", "In_Progress", "Completed"],
          default: "Pending",
        },
        targetDate: { type: String, required: true },
        completedDate: { type: String },
        description: { type: String },
      },
    ],
    publications: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        authors: { type: String, required: true },
        journal: { type: String, required: true },
        status: {
          type: String,
          enum: ["Draft", "Under Review", "Approved", "Published"],
          default: "Draft",
        },
        date: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Recruiting", "Completed", "Review"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const ResearchProjectModel =
  mongoose.models.ResearchProject ||
  mongoose.model<IResearchProject>("ResearchProject", ResearchProjectSchema);
