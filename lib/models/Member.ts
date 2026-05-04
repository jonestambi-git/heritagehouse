import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
  fullName: string;
  email: string;
  phone?: string;
  role: "MEMBER" | "LEADER" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: ["MEMBER", "LEADER", "ADMIN"],
      default: "MEMBER",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

MemberSchema.index({ email: 1 });

const Member: Model<IMember> =
  mongoose.models.Member ?? mongoose.model<IMember>("Member", MemberSchema);

export default Member;
