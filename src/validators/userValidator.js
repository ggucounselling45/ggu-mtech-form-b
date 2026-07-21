import { body, validationResult } from "express-validator";

export const validateSubmitForm = [

  // Personal Details
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),

  body("fatherName")
    .trim()
    .notEmpty()
    .withMessage("Father's Name is required."),

  body("motherName")
    .trim()
    .notEmpty()
    .withMessage("Mother's Name is required."),

  body("dob")
    .notEmpty()
    .withMessage("Date of Birth is required.")
    .isISO8601()
    .withMessage("Invalid Date of Birth."),

  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid Gender."),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("Nationality is required."),

  body("religion")
    .trim()
    .notEmpty()
    .withMessage("Religion is required."),

  body("category")
    .isIn(["General", "SC", "ST", "Gen EWS"])
    .withMessage("Invalid Category."),

  body("physicallyChallenged")
    .isBoolean()
    .withMessage("Physically Challenged must be true or false."),

  body("alreadyBtechStudent")
    .isBoolean()
    .withMessage("Already BTech Student must be true or false."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("mobileNo")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Mobile Number."),

  body("alternateMobileNo")
    .optional({ checkFalsy: true })
    .isMobilePhone("en-IN")
    .withMessage("Invalid Alternate Mobile Number."),

  // Fee Details
  body("referenceNo")
    .trim()
    .notEmpty()
    .withMessage("Reference Number is required."),

  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Amount must be greater than 0."),

  body("paymentDate")
    .isISO8601()
    .withMessage("Invalid Payment Date."),

  // Academic Details
  body("twelfthPercentage")
    .isFloat({ min: 0, max: 100 })
    .withMessage("12th Percentage must be between 0 and 100."),

  body("btechCollegeName")
    .trim()
    .notEmpty()
    .withMessage("BTech College Name is required."),

  body("btechCgpa")
    .isFloat({ min: 0, max: 10 })
    .withMessage("CGPA must be between 0 and 10."),

  body("gateRank")
    .isInt({ min: 1 })
    .withMessage("Invalid GATE Rank."),

  body("declarationAccepted")
    .equals("true")
    .withMessage("Please accept the declaration.")
];