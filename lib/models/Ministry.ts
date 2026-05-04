import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMinistry extends Document {
  name: string;
  tag: "MEN" | "WOMEN" | "YOUTH" | "FAMILIES" | "ALL_AGES";
  meets: string;
  leader: string;
  bio?: string;
  spots?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const MinistrySchema = new Schema<IMinistry>(
  {
    name: { type: String, required: true, trim: true },
    tag: {
      type: String,
      enum: ["MEN", "WOMEN", "YOUTH", "FAMILIES", "ALL_AGES"],
      default: "ALL_AGES",
    },
    meets: { type: String, required: true },
    leader: { type: String, required: true },
    bio: { type: String, default: "" },
    spots: { type: Number, default: null },
  },
  { timestamps: true }
);

const Ministry: Model<IMinistry> =
  mongoose.models.Ministry ??
  mongoose.model<IMinistry>("Ministry", MinistrySchema);

export default Ministry;
