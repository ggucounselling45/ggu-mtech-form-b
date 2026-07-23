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
  .isIn(["Gen", "Gen-EWS", "OBC-NCL", "SC", "ST"])
  .withMessage("Invalid Category."),

  body("physChallenged")
  .isIn(["Yes", "No"])
  .withMessage("Invalid Physically Challenged value."),


  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("mobile")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Mobile Number."),

  body("altMobile")
    .optional({ checkFalsy: true })
    .isMobilePhone("en-IN")
    .withMessage("Invalid Alternate Mobile Number."),

  // Fee Details
  body("refNo")
    .trim()
    .notEmpty()
    .withMessage("Reference Number is required."),

  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Amount must be greater than 0."),

 body("date_feepayment")
    .isISO8601()
    .withMessage("Invalid Payment Date."),

  // Academic Details
  body("marks12")
    .isFloat({ min: 0, max: 100 })
    .withMessage("12th Percentage must be between 0 and 100."),


  body("marksBTech")
    .isFloat({ min: 0, max: 100 })
    .withMessage("CGPA must be upto 10 & Percentage upto 100."),

 body("gateScore")
  .if(body("gateQualified").equals("Yes"))
  .isFloat({ min: 0 })
  .withMessage("Invalid GATE Score."),

  body("declaration")
    .equals("true")
    .withMessage("Please accept the declaration."),

  // Qualifying Exam
body("qualifyExam")
  .isIn(["B.Tech.", "M.Sc", "MCA", "Any other"])
  .withMessage("Invalid Qualifying Exam."),

// Branch of Study (required only for B.Tech.)
body("branchOfStudy")
  .if(body("qualifyExam").equals("B.Tech."))
  .trim()
  .notEmpty()
  .withMessage("Branch of Study is required."),

// Subject of Study (required only for M.Sc or MCA)
body("subjectOfStudy")
  .if((value, { req }) =>
    req.body.qualifyExam === "M.Sc" ||
    req.body.qualifyExam === "MCA"
  )
  .trim()
  .notEmpty()
  .withMessage("Subject of Study is required."),

// Other Qualification (required only for 'Any other')
body("otherQualification")
  .if(body("qualifyExam").equals("Any other"))
  .trim()
  .notEmpty()
  .withMessage("Please specify your qualification."),

// GATE Qualified
body("gateQualified")
  .isIn(["Yes", "No"])
  .withMessage("Invalid GATE qualification status."),

// GATE Application Number
body("applicationNum")
  .if(body("gateQualified").equals("Yes"))
  .trim()
  .notEmpty()
  .withMessage("GATE Application Number is required."),

// GATE Year
body("yearOfExam")
  .if(body("gateQualified").equals("Yes"))
  .isInt({ min: 2000, max: new Date().getFullYear() })
  .withMessage("Invalid GATE Examination Year."),

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

body("applicationNum")
  .if(body("gateQualified").equals("Yes"))
  .trim()
  .notEmpty()
  .withMessage("GATE Application Number is required.");

body("yearOfExam")
  .if(body("gateQualified").equals("Yes"))
  .isInt({ min: 2000, max: new Date().getFullYear() })
  .withMessage("Invalid GATE Examination Year.");