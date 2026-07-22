import bcrypt from "bcrypt";
import Forms from "../models/User.js";
import generateToken from "../utils/generateToken.js";

import FormSettings from "../models/FormSetting.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// export const registerUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and Password are required.",
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered.",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration Successful",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // export const loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,

// //         message: "Email and Password are required.",
// //       });
// //     }

// //     const user = await User.findOne({ email }).select("+password");

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,

// //         message: "Invalid Email or Password",
// //       });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);

// //     if (!isMatch) {
// //       return res.status(401).json({
// //         success: false,

// //         message: "Invalid Email or Password",
// //       });
// //     }

// //     const token = generateToken(user._id);

// //     res.cookie("token", token, {
// //       httpOnly: true,

// //       secure: false,

// //       sameSite: "lax",

// //       maxAge: 7 * 24 * 60 * 60 * 1000,
// //     });

// //     return res.status(200).json({
// //       success: true,

// //       message: "Login Successful",
// //     });
// //   } catch (error) {
// //     return res.status(500).json({
// //       success: false,

// //       message: error.message,
// //     });
// //   }
// // };

// export const getUserProfile = async (req, res) => {
//   try {
//     return res.status(200).json({
//       success: true,

//       user: req.user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };

// export const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("token");

//     return res.status(200).json({
//       success: true,

//       message: "Logout Successful",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,

//       message: error.message,
//     });
//   }
// };

// export const getFormStatus = async (req, res) => {
//   try {
//     const settings = await FormSettings.findOne();

//     if (!settings) {
//       return res.status(200).json({
//         success: true,
//         isFormActive: false,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       isFormActive: settings.isFormActive,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const submitForm = async (req, res) => {
  const uploadedPublicIds = [];
  try {
    const {
      email,
      password,
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

    // Read all text fields

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const forms = new Forms({
      email,
      password: hashedPassword, // We'll hash this before saving

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

      feeDetails: {
        referenceNo,
        amount,
        paymentDate,
      },

      academicDetails: {
        twelfthPercentage,
        btechCollegeName,
        btechCgpa,
        gateRank,
      },

      documents: uploadedDocuments,

      declarationAccepted,

      isSubmitted: true,

      submittedAt: new Date(),
    });

    await forms.save();

    return res.status(200).json({
      success: true,
      message: "Counselling form submitted successfully",
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
