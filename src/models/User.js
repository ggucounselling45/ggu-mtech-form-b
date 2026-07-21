import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    // =============================
    // Authentication
    // =============================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // =============================
    // Personal Details
    // =============================

    name: {
      type: String,
      default: "",
      trim: true,
    },

    fatherName: {
      type: String,
      default: "",
    },

    motherName: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    nationality: {
      type: String,
      default: "",
    },

    religion: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["General", "SC", "ST", "Gen EWS"],
    },

    physicallyChallenged: {
      type: Boolean,
      default: false,
    },

    alreadyBtechStudent: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      default: "",
    },

    mobileNo: {
      type: String,
      default: "",
    },

    alternateMobileNo: {
      type: String,
      default: "",
    },

    // =============================
    // Fee Details
    // =============================

    feeDetails: {
      referenceNo: String,

      amount: Number,

      paymentDate: Date,
    },

    // =============================
    // Academic Details
    // =============================

    academicDetails: {
      twelfthPercentage: Number,

      btechCollegeName: String,

      btechCgpa: Number,

      gateRank: Number,
    },

    // =============================
    // Documents
    // =============================

    documents: {
      passportPhoto: fileSchema,

      tenthMarksheet: fileSchema,

      twelfthMarksheet: fileSchema,

      aadhaarCard: fileSchema,

      btechMarksheet: fileSchema,

      gateScoreCard: fileSchema,

      categoryCertificate: fileSchema,

      feeReceipt: fileSchema,

      applicationForm: fileSchema,
    },

    // =============================
    // Submission
    // =============================

    declarationAccepted: {
      type: Boolean,

      default: false,
    },

    isSubmitted: {
      type: Boolean,

      default: false,
    },

    submittedAt: Date,

    verificationStatus: {
      type: String,

      enum: ["Pending", "Verified", "Rejected"],

      default: "Pending",
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
