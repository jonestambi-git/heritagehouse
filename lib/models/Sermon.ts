import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISermon extends Document {
  slug: string;
  title: string;
  subtitle?: string;
  series?: string;
  tag: string;
  date: string;
  dateISO?: string;
  pastor: string;
  pastorRole?: string;
  scripture?: string;
  excerpt?: string;
  body?: string;
  featured?: boolean;
  podcastLinks?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SermonSchema = new Schema<ISermon>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    series: { type: String, default: "" },
    tag: { type: String, required: true },
    date: { type: String, default: "" },
    dateISO: { type: String, default: "" },
    pastor: { type: String, required: true },
    pastorRole: { type: String, default: "" },
    scripture: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    podcastLinks: {
      spotify: { type: String, default: "" },
      apple: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

SermonSchema.index({ dateISO: -1 });
SermonSchema.index({ featured: 1 });

const Sermon: Model<ISermon> =
  mongoose.models.Sermon ?? mongoose.model<ISermon>("Sermon", SermonSchema);

export default Sermon;
