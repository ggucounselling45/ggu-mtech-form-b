import mongoose from "mongoose";

const btechformSettingsSchema = new mongoose.Schema(
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

export default mongoose.model("BtechFormSettings", btechformSettingsSchema);