import mongoose, { Schema, Document, Model } from "mongoose";

export interface INews extends Document {
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    date: { type: String, default: "" },
    venue: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

NewsSchema.index({ createdAt: -1 });
NewsSchema.index({ active: 1 });

const News: Model<INews> =
  mongoose.models.News ?? mongoose.model<INews>("News", NewsSchema);

export default News;
