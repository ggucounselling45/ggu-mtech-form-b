import { body, validationResult } from "express-validator";

export const validateSubmitForm = [
  // Personal Details
  body("name").trim().notEmpty().withMessage("Name is required."),

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

  body("nationality").trim().notEmpty().withMessage("Nationality is required."),

  body("religion").trim().notEmpty().withMessage("Religion is required."),

  body("category")
    .isIn(["Gen", "Gen-EWS", "OBC-NCL", "SC", "ST"])
    .withMessage("Invalid Category."),

  body("physChallenged")
    .isIn(["Yes", "No"])
    .withMessage("Invalid Physically Challenged value."),

  body("address").trim().notEmpty().withMessage("Address is required."),

  body("mobile").isMobilePhone("en-IN").withMessage("Invalid Mobile Number."),

  body("altMobile")
    .optional({ checkFalsy: true })
    .isMobilePhone("en-IN")
    .withMessage("Invalid Alternate Mobile Number."),

  // Fee Details
  body("refNo").trim().notEmpty().withMessage("Reference Number is required."),

  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Amount must be greater than 0."),

  body("date_feepayment").isISO8601().withMessage("Invalid Payment Date."),

  // Academic Details
  body("marks12")
    .isFloat({ min: 0, max: 100 })
    .withMessage("12th Percentage must be between 0 and 100."),

    body("twelfthBoardName")
    .trim()
    .notEmpty()
    .withMessage("twelfthBoardNameis required."),

    body("twelfthPassingYear")
    .notEmpty()
    .withMessage("twelfthPassingYear is required.")
    .isISO8601()
    .withMessage("Invalid twelfthPassingYear."),

  body("jeeMainRoll")
    .trim()
    .notEmpty()
    .withMessage("JEE Main Roll Number is required."),

  body("jeeMainAllIndiaRank")
    .trim()
    .notEmpty()
    .withMessage("JEE Main All India Rank is required."),

  body("declaration")
    .equals("true")
    .withMessage("Please accept the declaration."),

  body("admissionStatus")
    .isIn(["Yes", "No"])
    .withMessage("Invalid admission status"),

  // Branch Alloted by (JOSAA or CSAB)
  body("BranchAllotedBy")
    .if(body("admissionStatus").equals("Yes"))
    .trim()
    .notEmpty()
    .withMessage("Select the counselling through which branch is alloted"),

  // Branch Name (required only if already admitted)
  body("branchName")
    .if(body("admissionStatus").equals("Yes"))
    .trim()
    .notEmpty()
    .withMessage("Program Name is required."),

  // Mail Declaration
  body("mailDeclaration")
    .equals("true")
    .withMessage("Please confirm that you have sent the email."),

  // Transaction ID / UTR
  body("bank")
    .trim()
    .notEmpty()
    .withMessage("Transaction ID / UTR is required."),
];
