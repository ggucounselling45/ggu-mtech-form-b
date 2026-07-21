import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controller/user.js";
import userAuth from "../middleware/userAuth.js";
import { getFormStatus } from "../controller/user.js";
import { submitForm } from "../controller/user.js";
import upload from "../middleware/upload.js";
import validateFiles from "../validators/fileValidators.js";
import { validateSubmitForm } from "../validators/userValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const uploadFields = upload.fields([
  {
    name: "passportPhoto",
    maxCount: 1,
  },

  {
    name: "tenthMarksheet",
    maxCount: 1,
  },

  {
    name: "twelfthMarksheet",
    maxCount: 1,
  },

  {
    name: "aadhaarCard",
    maxCount: 1,
  },

  {
    name: "btechMarksheet",
    maxCount: 1,
  },

  {
    name: "gateScoreCard",
    maxCount: 1,
  },

  {
    name: "categoryCertificate",
    maxCount: 1,
  },

  {
    name: "feeReceipt",
    maxCount: 1,
  },

  {
    name: "applicationForm",
    maxCount: 1,
  },
]);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", userAuth, getUserProfile);

router.post("/logout", userAuth, logoutUser);

router.get("/form-status", getFormStatus);

router.put(
  "/submit-form",
  userAuth,
  uploadFields,
  validateSubmitForm,
  validate,
  validateFiles,
  submitForm,
);

export default router;
