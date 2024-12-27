import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {                               //like job model se connect kr diya h
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {                         //like user model se connect kr diya h
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
export const Application = mongoose.model("Application", applicationSchema);
