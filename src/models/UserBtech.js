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
      enum: ["Gen", "Gen-EWS", "OBC-NCL", "SC", "ST"],
    },

    physicallyChallenged: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    altMobile: {
      type: String,
      default: "",
    },

    // =============================
    // Fee Details
    // =============================

    feeDetails: {
      referenceNo: String,

      amount: Number,

      bank: String,

      paymentDate: Date,
    },

    // =============================
    // Academic Details
    // =============================

    academicDetails: {
      marks12: Number,

      twelfthBoardName: {
        type: String,
        default: "",
        trim: true,
      },
      twelfthPassingYear: {
        type: Date,
      },

      jeeMainRoll: Number,

      jeeMainAllIndiaRank: Number, //gate rank===gate marks
    },

    admissionDetails: {
      BranchAllotedBy: {
        type: String,
        enum: ["Yes", "No"],
      },

      BranchAllotedBy: {
        type: String,
        enum: ["JoSAA", "CSAB"],
      },
      branchName: {
        type: String,
        default: "",
      },
    },

    // =============================
    // Documents
    // =============================

    documents: {
      passportPhoto: fileSchema,

      marksheet10: fileSchema,

      marksheet12: fileSchema,

     

      jeeMainScorecard: fileSchema,
      DomicileCert:fileSchema,

      categoryCert: fileSchema,

      pwdCert: fileSchema,

      allotmentLetter: fileSchema,

      feeReceipt: fileSchema,

      appForm: fileSchema,
    },

    // =============================
    // Submission
    // =============================

    declarationAccepted: Boolean,

    mailDeclaration: Boolean,

    isSubmitted: {
      type: Boolean,

      default: false,
    },

    submittedAt: Date,
  },

  {
    timestamps: true,
  },
);

export default mongoose.model("FormsBtech", userSchema);
