import bcrypt from "bcrypt";
import Forms from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import FormSettings from "../models/FormSetting.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";



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

      mobile,
      altMobile,

      refNo,
      amount,
      bank,
      date_feepayment,

      qualifyExam,
      branchOfStudy,
      subjectOfStudy,
      otherQualification,
      marks12,
      marksBTech,

      gateQualified,
      applicationNum,
      yearOfExam,
      gateScore,

      physChallenged,
      admissionStatus,
      branchName,

      declaration,
      mailDeclaration,
    } = req.body;

    const existingUser = await Forms.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A form has already been submitted using this email.",
      });
    }

    // Check if form is active
    const settings = await FormSettings.findOne();

    if (!settings || !settings.isFormActive) {
      return res.status(403).json({
        success: false,
        message: "Counselling form is currently closed.",
      });
    }

    const files = req.files;

    const documentFolders = {
      passportPhoto: "GGU-Counselling/passportPhoto",
      marksheet10: "GGU-Counselling/marksheet10",
      marksheet12: "GGU-Counselling/marksheet12",
      gateQualifyExam: "GGU-Counselling/gateQualifyExam",
      gateScorecard: "GGU-Counselling/gateScorecard",
      categoryCert: "GGU-Counselling/categoryCertificate",
      pwdCert: "GGU-Counselling/pwdCertificate",
      allotmentLetter: "GGU-Counselling/allotmentLetter",
      feeReceipt: "GGU-Counselling/feeReceipt",
      appForm: "GGU-Counselling/applicationForm",
    };

    const uploadedDocuments = {};

    for (const field in documentFolders) {
      if (files[field]) {
        const uploaded = await uploadToCloudinary(
          files[field][0].buffer,
          documentFolders[field]
        );

        uploadedDocuments[field] = uploaded;
        uploadedPublicIds.push(uploaded.public_id);
      }
    }


    const form = new Forms({
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
        referenceNo: refNo,
        amount: Number(amount),
        bank,
        paymentDate: date_feepayment,
      },

      academicDetails: {
        qualifyExam,
        branchOfStudy,
        subjectOfStudy,
        otherQualification,
        marks12: Number(marks12),
        marksBTech: Number(marksBTech),

        gateQualified: gateQualified === "Yes",
        applicationNum,
        yearOfExam: yearOfExam ? Number(yearOfExam) : undefined,
        gateScore: gateScore ? Number(gateScore) : undefined,
      },

      admissionDetails: {
        admissionStatus: admissionStatus === "Yes",
        branchName,
      },

      documents: uploadedDocuments,

      declarationAccepted: declaration === "true" || declaration === true,
      mailDeclaration: mailDeclaration === "true" || mailDeclaration === true,

      isSubmitted: true,
      submittedAt: new Date(),
    });

    await form.save();

    return res.status(200).json({
      success: true,
      message: "Counselling form submitted successfully.",
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