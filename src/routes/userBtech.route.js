import express from "express";

import userAuth from "../middleware/userAuth.js";

import { submitForm } from "../controller/userBtech.js";
import upload from "../middleware/upload.js";
import validateFiles from "../validators/userBtechfileValidators.js";
import { validateSubmitForm } from "../validators/userBtechValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "passportPhoto", maxCount: 1 },
  { name: "marksheet10", maxCount: 1 },
  { name: "marksheet12", maxCount: 1 },
  { name: "DomicileCert", maxCount: 1 },
  { name: "jeeMainScoreCard", maxCount: 1 },
  { name: "categoryCert", maxCount: 1 },
  { name: "pwdCert", maxCount: 1 },
  { name: "allotmentLetter", maxCount: 1 },
  { name: "feeReceipt", maxCount: 1 },
  { name: "appForm", maxCount: 1 },
]);

router.post(
  "/submit-Btech-form",

  uploadFields,
  validateSubmitForm,
  validate,
  validateFiles,
  submitForm,
);

export default router;
