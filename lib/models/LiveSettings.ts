import mongoose, { Schema, Document } from "mongoose";

export interface ILiveSettings extends Document {
  streamUrl: string;
  title: string;
  description: string;
  isLive: boolean;
  previousStreams: Array<{
    id: string;
    streamUrl: string;
    title: string;
    description: string;
    date: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const liveSettingsSchema = new Schema<ILiveSettings>(
  {
    streamUrl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Sunday Service",
    },
    description: {
      type: String,
      default: "Join us live for worship and the Word.",
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    previousStreams: [
      {
        id: String,
        streamUrl: String,
        title: String,
        description: String,
        date: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.LiveSettings ||
  mongoose.model<ILiveSettings>("LiveSettings", liveSettingsSchema);
