import bcrypt from "bcrypt";
import FormsBtech from "../models/UserBtech.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import BtechFormSettings from "../models/BtechFormSetting.js";
import sendEmail from "../utils/sendEmail.js";


export const submitForm = async (req, res) => {
  const uploadedPublicIds = [];

  try {
    const {
      email,
      name,
      fatherName,
      motherName,
      dob,
      gender,
      nationality,
      religion,
      category,
      address,
      marks12,

      mobile,
      altMobile,

      refNo,
      amount,
      bank,
      date_feepayment,
      twelfthBoardName,
      twelfthPassingYear,

      admissionStatus,
      BranchAllotedBy,
      branchName,
      
      jeeMainApplicationNumber,
      jeeMainAllIndiaRank,

      physChallenged,

      declaration,
      mailDeclaration,
    } = req.body;

    const existingUser = await FormsBtech.findOne({
      "feeDetails.refNo": refNo,
    });

     if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "A form has already been submitted using this Reference number.",
      });
    }

    // Check if form is active
    const settings = await BtechFormSettings.findOne();

    if (!settings || !settings.isFormActive) {
      return res.status(403).json({
        success: false,
        message: "Counselling form is currently closed.",
      });
    }

    const files = req.files;

    const documentFolders = {
      passportPhoto: "GGU-Counselling-Btech/passportPhoto",
      marksheet10: "GGU-Counselling-Btech/marksheet10",
      marksheet12: "GGU-Counselling-Btech/marksheet12",

      jeeMainScoreCard: "GGU-Counselling-Btech/jeeMainScoreCard",
      categoryCert: "GGU-Counselling-Btech/categoryCertificate",
      pwdCert: "GGU-Counselling-Btech/pwdCertificate",
      allotmentLetter: "GGU-Counselling-Btech/allotmentLetter",
      feeReceipt: "GGU-Counselling-Btech/feeReceipt",
      appForm: "GGU-Counselling-Btech/applicationForm",
    };

    const uploadedDocuments = {};

    for (const field in documentFolders) {
      if (files[field]) {
        const uploaded = await uploadToCloudinary(
          files[field][0].buffer,
          documentFolders[field],
        );

        uploadedDocuments[field] = uploaded;
        uploadedPublicIds.push(uploaded.public_id);
      }
    }

    const form = new FormsBtech({
      email,
      name,
      fatherName,
      motherName,
      dob,
      gender,
      nationality,
      religion,
      category,
      address,

      mobile,
      altMobile,

      physChallenged: physChallenged === "Yes",

      feeDetails: {
        refNo: refNo,
        amount: Number(amount),
        bank,
        paymentDate: date_feepayment,
      },

      academicDetails: {
        marks12: Number(marks12),
        twelfthBoardName,
        twelfthPassingYear,

       
      },

      admissionDetails: {
        admissionStatus: admissionStatus === "Yes",
        BranchAllotedBy,
        branchName,
      },
      jeeMainApplicationNumber: Number(jeeMainApplicationNumber),
      jeeMainAllIndiaRank: Number(jeeMainAllIndiaRank),

      documents: uploadedDocuments,

      declarationAccepted: declaration === "true" || declaration === true,
      mailDeclaration: mailDeclaration === "true" || mailDeclaration === true,

      isSubmitted: true,
      submittedAt: new Date(),
    });

    await form.save();
    

    await sendEmail(
      form.email,
      "Admission Form Submitted Successfully",
      `
  <h2>Admission Form Submitted Successfully</h2>

  <p>Dear <strong>${form.name}</strong>,</p>

  <p>Your admission form has been submitted successfully.</p>

  <p><strong>Application ID:</strong> ${form.applicationId}</p>

  <p>Please keep this ID for future reference.</p>

  <br>
  <p>Thank You</p>
  `,
    );

    return res.status(200).json({
      success: true,
      message: "Counselling form for Btech submitted successfully.",
    });
  } catch (error) {
    for (const publicId of uploadedPublicIds) {
      await deleteFromCloudinary(publicId);
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
