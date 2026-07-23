import mongoose from "mongoose";

const formSettingsSchema = new mongoose.Schema(
  {
    isFormActive: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("FormSettings", formSettingsSchema);
