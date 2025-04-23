import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, required: true, unique: true },
    longUrl: { type: String, required: true },

    visitHistory: [
      {
        timestamp: { type: Number },
        userAgent: { type: String },
        referrer: { type: String },
        browser: { type: String },
        os: { type: String },
        device: { type: String },
        country: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

export default URL;
