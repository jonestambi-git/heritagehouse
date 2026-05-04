import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "SERVICE" | "PRAYER" | "YOUTH" | "OUTREACH" | "OTHER";
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: {
      type: String,
      enum: ["SERVICE", "PRAYER", "YOUTH", "OUTREACH", "OTHER"],
      default: "SERVICE",
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

EventSchema.index({ date: -1 });

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
