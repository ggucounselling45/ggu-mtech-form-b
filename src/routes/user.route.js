import express from "express";
// import {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   logoutUser,
// } from "../controller/user.js";
import userAuth from "../middleware/userAuth.js";
// import { getFormStatus } from "../controller/user.js";
import { submitForm } from "../controller/user.js";
import upload from "../middleware/upload.js";
import validateFiles from "../validators/fileValidators.js";
import { validateSubmitForm } from "../validators/userValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "passportPhoto", maxCount: 1 },
  { name: "marksheet10", maxCount: 1 },
  { name: "marksheet12", maxCount: 1 },
  { name: "gateQualifyExam", maxCount: 1 },
  { name: "gateScorecard", maxCount: 1 },
  { name: "categoryCert", maxCount: 1 },
  { name: "pwdCert", maxCount: 1 },
  { name: "allotmentLetter", maxCount: 1 },
  { name: "feeReceipt", maxCount: 1 },
  { name: "appForm", maxCount: 1 },
]);

router.post(
  "/submit-form",

  uploadFields,
  validateSubmitForm,
  validate,
  validateFiles,
  submitForm,
);

export default router;
