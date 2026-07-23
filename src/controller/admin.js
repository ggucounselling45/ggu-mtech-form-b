import bcrypt from "bcrypt";
import AdminUser from "../models/AdminUser.js";
import generateToken from "../utils/generateToken.js";
import ExcelJS from "exceljs";
import Forms from "../models/User.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    const admin = await AdminUser.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = generateToken(admin._id);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        isActive: req.admin.isActive,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Allowed Roles
    const allowedRoles = ["institution", "teacher", "hod", "subAdmin", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Check if email already exists
    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists with this email",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User
    const adminUser = await AdminUser.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Admin User created successfully",
      admin: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

//api to get all application
export const getAllApplications = async (req, res) => {
  try {
    const forms = await Forms.find(
      {
        isSubmitted: true,
      },
      {
        password: 0,
      },
    ).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      totalApplications: forms.length,
      applications: forms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadApplicationsExcel = async (req, res) => {
  try {
    // Get all submitted applications
    const applications = await Forms.find(
      { isSubmitted: true },
      { password: 0 },
    ).sort({ createdAt: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "GGU Admission Portal";
    workbook.created = new Date();

    // Create worksheet
    const worksheet = workbook.addWorksheet("Student Applications");

    // Define columns
    worksheet.columns = [
      // Personal Information
      { header: "Application ID", key: "id", width: 30 },
      { header: "Name", key: "name", width: 25 },
      { header: "Father Name", key: "fatherName", width: 25 },
      { header: "Mother Name", key: "motherName", width: 25 },
      { header: "Email", key: "email", width: 35 },
      { header: "DOB", key: "dob", width: 15 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Nationality", key: "nationality", width: 18 },
      { header: "Religion", key: "religion", width: 18 },
      { header: "Category", key: "category", width: 15 },
      {
        header: "Physically Challenged",
        key: "physicallyChallenged",
        width: 22,
      },

      // Contact
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "Alternate Mobile", key: "altMobile", width: 18 },
      { header: "Address", key: "address", width: 45 },

      // Academic
      { header: "Qualifying Exam", key: "qualifyExam", width: 22 },
      { header: "Branch Of Study", key: "branchOfStudy", width: 22 },
      { header: "Subject Of Study", key: "subjectOfStudy", width: 22 },
      { header: "Other Qualification", key: "otherQualification", width: 22 },
      { header: "12th Marks (%)", key: "marks12", width: 15 },
      { header: "B.Tech Marks", key: "marksBTech", width: 15 },

      // GATE
      { header: "GATE Qualified", key: "gateQualified", width: 18 },
      { header: "GATE Application No", key: "applicationNum", width: 22 },
      { header: "GATE Year", key: "yearOfExam", width: 15 },
      { header: "GATE Score", key: "gateScore", width: 15 },

      // Admission
      { header: "CCMT Admission", key: "admissionStatus", width: 18 },
      { header: "Branch Name", key: "branchName", width: 25 },

      // Fee
      { header: "Reference No", key: "referenceNo", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Bank", key: "bank", width: 25 },
      { header: "Payment Date", key: "paymentDate", width: 18 },

      // Documents
      { header: "Passport Photo", key: "passportPhoto", width: 40 },
      { header: "10th Marksheet", key: "marksheet10", width: 40 },
      { header: "12th Marksheet", key: "marksheet12", width: 40 },
      { header: "Degree Certificate", key: "gateQualifyExam", width: 40 },
      { header: "GATE Scorecard", key: "gateScorecard", width: 40 },
      { header: "Category Certificate", key: "categoryCert", width: 40 },
      { header: "PWD Certificate", key: "pwdCert", width: 40 },
      { header: "Allotment Letter", key: "allotmentLetter", width: 40 },
      { header: "Fee Receipt", key: "feeReceipt", width: 40 },
      { header: "Application Form", key: "appForm", width: 40 },

      // Metadata
      { header: "Submitted At", key: "createdAt", width: 22 },
    ];

    applications.forEach((application) => {
      worksheet.addRow({
        // Personal Information
        id: application._id.toString(),
        name: application.name,
        fatherName: application.fatherName,
        motherName: application.motherName,
        email: application.email,
        dob: application.dob
          ? new Date(application.dob).toLocaleDateString("en-IN")
          : "",
        gender: application.gender,
        nationality: application.nationality,
        religion: application.religion,
        category: application.category,
        physicallyChallenged: application.physicallyChallenged ? "Yes" : "No",

        // Contact
        mobile: application.mobile,
        altMobile: application.altMobile,
        address: application.address,

        // Academic
        qualifyExam: application.academicDetails?.qualifyExam,
        branchOfStudy: application.academicDetails?.branchOfStudy,
        subjectOfStudy: application.academicDetails?.subjectOfStudy,
        otherQualification: application.academicDetails?.otherQualification,
        marks12: application.academicDetails?.marks12,
        marksBTech: application.academicDetails?.marksBTech,

        // GATE
        gateQualified: application.academicDetails?.gateQualified
          ? "Yes"
          : "No",
        applicationNum: application.academicDetails?.applicationNum,
        yearOfExam: application.academicDetails?.yearOfExam,
        gateScore: application.academicDetails?.gateScore,

        // Admission
        admissionStatus: application.admissionDetails?.admissionStatus
          ? "Yes"
          : "No",
        branchName: application.admissionDetails?.branchName,

        // Fee
        referenceNo: application.feeDetails?.referenceNo,
        amount: application.feeDetails?.amount,
        bank: application.feeDetails?.bank,
        paymentDate: application.feeDetails?.paymentDate
          ? new Date(application.feeDetails.paymentDate).toLocaleDateString(
              "en-IN",
            )
          : "",

        // Documents
        passportPhoto: application.documents?.passportPhoto?.url,
        marksheet10: application.documents?.marksheet10?.url,
        marksheet12: application.documents?.marksheet12?.url,
        gateQualifyExam: application.documents?.gateQualifyExam?.url,
        gateScorecard: application.documents?.gateScorecard?.url,
        categoryCert: application.documents?.categoryCert?.url,
        pwdCert: application.documents?.pwdCert?.url,
        allotmentLetter: application.documents?.allotmentLetter?.url,
        feeReceipt: application.documents?.feeReceipt?.url,
        appForm: application.documents?.appForm?.url,

        // Metadata
        createdAt: application.createdAt
          ? new Date(application.createdAt).toLocaleString("en-IN")
          : "",
      });
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Freeze header row
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Enable filter
    worksheet.autoFilter = {
      from: "A1",
      to: {
        row: 1,
        column: worksheet.columnCount,
      },
    };

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="GGU_Student_Applications.xlsx"',
    );

    // Write workbook to response
    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
