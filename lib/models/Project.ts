import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  slug: string;
  title: string;
  category: "Construction" | "Outreach" | "Education" | "Relief";
  status: "Ongoing" | "Completed" | "Upcoming";
  year: string;
  lead?: string;
  summary: string;
  body?: string;
  goal?: string | null;
  raised?: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Construction", "Outreach", "Education", "Relief"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Upcoming"],
      default: "Ongoing",
    },
    year: { type: String, required: true },
    lead: { type: String, default: "Church Leadership" },
    summary: { type: String, required: true },
    body: { type: String, default: "" },
    goal: { type: String, default: null },
    raised: { type: String, default: null },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ??
  mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
