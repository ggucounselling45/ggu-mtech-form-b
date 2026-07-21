import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import FormSettings from "../models/FormSetting.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,

        message: "Email and Password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid Email or Password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,

      secure: false,

      sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,

      message: "Login Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,

      message: "Logout Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getFormStatus = async (req, res) => {
  try {
    const settings = await FormSettings.findOne();

    if (!settings) {
      return res.status(200).json({
        success: true,
        isFormActive: false,
      });
    }

    return res.status(200).json({
      success: true,
      isFormActive: settings.isFormActive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const submitForm = async (req, res) => {
  try {
    // Logged in user
    const user = req.user;

    // Check if form is active
    const settings = await FormSettings.findOne();

    if (!settings || !settings.isFormActive) {
      return res.status(403).json({
        success: false,
        message: "Counselling form is currently closed.",
      });
    }

    // Prevent duplicate submission
    if (user.isSubmitted) {
      return res.status(400).json({
        success: false,
        message: "Form has already been submitted.",
      });
    }

    // Read all text fields
    const {
      name,
      fatherName,
      motherName,
      dob,
      gender,
      nationality,
      religion,
      category,
      physicallyChallenged,
      alreadyBtechStudent,
      address,
      mobileNo,
      alternateMobileNo,

      referenceNo,
      amount,
      paymentDate,

      twelfthPercentage,
      btechCollegeName,
      btechCgpa,
      gateRank,

      declarationAccepted,
    } = req.body;

    // Read uploaded files
    const files = req.files;

    const documentFolders = {
      passportPhoto: "GGU-Counselling/passportPhoto",

      tenthMarksheet: "GGU-Counselling/tenthMarksheet",

      twelfthMarksheet: "GGU-Counselling/twelfthMarksheet",

      aadhaarCard: "GGU-Counselling/aadhaarCard",

      btechMarksheet: "GGU-Counselling/btechMarksheet",

      gateScoreCard: "GGU-Counselling/gateScoreCard",

      categoryCertificate: "GGU-Counselling/categoryCertificate",

      feeReceipt: "GGU-Counselling/feeReceipt",

      applicationForm: "GGU-Counselling/applicationForm",
    };

    const uploadedDocuments = {};
    const uploadedPublicIds = [];
    for (const field in documentFolders) {
      if (files[field]) {
        const uploaded = await uploadToCloudinary(
          files[field][0].path,
          documentFolders[field],
        );

        uploadedDocuments[field] = uploaded;

        uploadedPublicIds.push(uploaded.public_id);
      }
    }

    //saving personal details
    user.name = name.trim();

    user.fatherName = fatherName.trim();

    user.motherName = motherName.trim();

    user.dob = dob;

    user.gender = gender;

    user.nationality = nationality.trim();

    user.religion = religion.trim();

    user.category = category;

    user.physicallyChallenged = physicallyChallenged;

    user.alreadyBtechStudent = alreadyBtechStudent;

    user.address = address.trim();

    user.mobileNo = mobileNo;

    user.alternateMobileNo = alternateMobileNo;

    //saving the fee details

    user.feeDetails = {
      referenceNo,

      amount,

      paymentDate,
    };

    //saving the academic details
    user.academicDetails = {
      twelfthPercentage,

      btechCollegeName,

      btechCgpa,

      gateRank,
    };

    //saving the uploaded documents
    user.documents = uploadedDocuments;

    //Mark the form as submitted
    user.declarationAccepted = declarationAccepted;

    user.isSubmitted = true;

    user.submittedAt = new Date();

    //save the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Counselling form submitted successfully",
    });
  } catch (error) {
    for (const publicId of uploadedPublicIds) {
      await deleteFromCloudinary(publicId);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
