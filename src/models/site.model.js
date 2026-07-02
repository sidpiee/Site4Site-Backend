import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Site =  mongoose.model("Site", siteSchema);