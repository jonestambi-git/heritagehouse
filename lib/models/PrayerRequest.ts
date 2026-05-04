import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrayerRequest extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrayerRequestSchema = new Schema<IPrayerRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "general" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PrayerRequestSchema.index({ createdAt: -1 });
PrayerRequestSchema.index({ read: 1 });

const PrayerRequest: Model<IPrayerRequest> =
  mongoose.models.PrayerRequest ??
  mongoose.model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);

export default PrayerRequest;
