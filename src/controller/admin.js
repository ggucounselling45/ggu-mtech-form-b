import bcrypt from "bcrypt";
import AdminUser from "../models/AdminUser.js";
import generateToken from "../utils/generateToken.js";
import ExcelJS from "exceljs";
import Forms from "../models/User.js";
import FormsBtech from "../models/UserBtech.js";
import FormSettings from "../models/FormSetting.js";
import BtechFormSettings from "../models/BtechFormSetting.js";


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

    if (!admin.status) {
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

export const createUser = async (req, res) => {
  try {
    const { name, email, mobileNo, password,  role, status } = req.body;

    // Validation
    if (!name || !email || !password || !mobileNo || !role || !status) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Allowed Roles
    const allowedRoles = ["teacher", "hod", "subAdmin"];

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
      mobileNo,
      password: hashedPassword,
      role,
      status,
    });

    return res.status(201).json({
      message: "Admin User created successfully",
      admin: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        mobileNo: adminUser.mobileNo,
        role: adminUser.role,
        status: adminUser.status,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
//api to get all the users
export const getUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      mobileNo,
      password,
      role,
      status,
    } = req.body;

    const user = await AdminUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Email already exists
    if (email && email !== user.email) {
      const existingUser = await AdminUser.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Role validation
    if (role) {
      const allowedRoles = ["teacher", "hod", "subAdmin"];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobileNo) user.mobileNo = mobileNo;
    if (role) user.role = role;
    if (status) user.status = status;

    // Update password only if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await AdminUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await AdminUser.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
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
      { header: "Application ID", key: "applicationId", width: 20 },
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
      { header: "B.Tech CGPA", key: "cgpa", width: 15 },
      { header: "B.Tech Percentage", key: "percentage", width: 15 },

      // GATE
      { header: "GATE Qualified", key: "gateQualified", width: 18 },
      { header: "GATE Application No", key: "applicationNum", width: 22 },
      { header: "GATE Year", key: "yearOfExam", width: 15 },
      { header: "GATE Score", key: "gateScore", width: 15 },
      { header: "GATE Marks", key: "gateRank", width: 15 },

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
        applicationId: application.applicationId,
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
        cgpa: application.academicDetails?.cgpa,
        percentage: application.academicDetails?.percentage,

        // GATE
        gateQualified: application.academicDetails?.gateQualified
          ? "Yes"
          : "No",
        applicationNum: application.academicDetails?.applicationNum,
        yearOfExam: application.academicDetails?.yearOfExam,
        gateScore: application.academicDetails?.gateScore,
        gateRank: application.academicDetails?.gateRank,
     

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

//creating Admin Apis for btech....



export const getAllBtechApplications = async (req, res) => {
  try {
    const forms = await FormsBtech.find(
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



export const downloadBtechApplicationsExcel = async (req, res) => {
  try {
    // Get all submitted applications
    const applications = await FormsBtech.find(
      { isSubmitted: true },
      { password: 0 },
    ).sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found to export",
      });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "GGU B.Tech Admission Portal";
    workbook.created = new Date();

    // Create worksheet
    const worksheet = workbook.addWorksheet("B.Tech Student Applications");

    // ============ Define Columns ============
    worksheet.columns = [
      // Personal Information
      { header: "Application ID", key: "applicationId", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Father's Name", key: "fatherName", width: 25 },
      { header: "Mother's Name", key: "motherName", width: 25 },
      { header: "Email", key: "email", width: 35 },
      { header: "Date of Birth", key: "dob", width: 18 },
      { header: "Gender", key: "gender", width: 15 },
      { header: "Nationality", key: "nationality", width: 18 },
      { header: "Religion", key: "religion", width: 18 },
      { header: "Category", key: "category", width: 15 },
      {
        header: "Physically Challenged",
        key: "physicallyChallenged",
        width: 22,
      },

      // Contact Details
      { header: "Mobile Number", key: "mobile", width: 18 },
      { header: "Alternate Mobile", key: "altMobile", width: 18 },
      { header: "Address", key: "address", width: 45 },

      // Academic Details
      { header: "12th Marks (%)", key: "marks12", width: 18 },
      { header: "12th Board Name", key: "twelfthBoardName", width: 25 },
      { header: "12th Passing Year", key: "twelfthPassingYear", width: 20 },

      // Admission Details
      { header: "Branch Alloted By", key: "BranchAllotedBy", width: 25 },
      { header: "Branch Name", key: "branchName", width: 25 },

      // Fee Details
      { header: "Reference No", key: "refNo", width: 25 },
      { header: "Fee Amount (₹)", key: "amount", width: 18 },
      { header: "Bank/UTR", key: "bank", width: 25 },
      { header: "Payment Date", key: "paymentDate", width: 18 },

      // Documents - URLs
      { header: "Passport Photo", key: "passportPhoto", width: 50 },
      { header: "10th Marksheet", key: "marksheet10", width: 50 },
      { header: "12th Marksheet", key: "marksheet12", width: 50 },
      { header: "Category Certificate", key: "categoryCert", width: 50 },
      { header: "PWD Certificate", key: "pwdCert", width: 50 },
      { header: "Allotment Letter", key: "allotmentLetter", width: 50 },
      { header: "Fee Receipt", key: "feeReceipt", width: 50 },
      { header: "Application Form", key: "appForm", width: 50 },

      // Metadata
      { header: "Declaration Accepted", key: "declarationAccepted", width: 22 },
      { header: "Mail Declaration", key: "mailDeclaration", width: 22 },
      { header: "Submitted At", key: "submittedAt", width: 22 },
      { header: "Created At", key: "createdAt", width: 22 },
    ];

    // ============ Add Data Rows ============
    applications.forEach((application) => {
      const row = {
        // Personal Information
        applicationId: application.applicationId || "N/A",
        name: application.name || "N/A",
        fatherName: application.fatherName || "N/A",
        motherName: application.motherName || "N/A",
        email: application.email || "N/A",
        dob: application.dob
          ? new Date(application.dob).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "N/A",
        gender: application.gender || "N/A",
        nationality: application.nationality || "N/A",
        religion: application.religion || "N/A",
        category: application.category || "N/A",
        physicallyChallenged: application.physicallyChallenged ? "Yes" : "No",

        // Contact Details
        mobile: application.mobile || "N/A",
        altMobile: application.altMobile || "N/A",
        address: application.address || "N/A",

        // Academic Details
        marks12: application.academicDetails?.marks12 || "N/A",
        twelfthBoardName: application.academicDetails?.twelfthBoardName || "N/A",
        twelfthPassingYear: application.academicDetails?.twelfthPassingYear
          ? new Date(
              application.academicDetails.twelfthPassingYear
            ).getFullYear()
          : "N/A",

        // Admission Details
        BranchAllotedBy: application.admissionDetails?.BranchAllotedBy || "N/A",
        branchName: application.admissionDetails?.branchName || "N/A",

        // Fee Details
        refNo: application.feeDetails?.refNo || "N/A",
        amount: application.feeDetails?.amount || "N/A",
        bank: application.feeDetails?.bank || "N/A",
        paymentDate: application.feeDetails?.paymentDate
          ? new Date(application.feeDetails.paymentDate).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )
          : "N/A",

        // Documents
        passportPhoto: application.documents?.passportPhoto?.url || "N/A",
        marksheet10: application.documents?.marksheet10?.url || "N/A",
        marksheet12: application.documents?.marksheet12?.url || "N/A",
        categoryCert: application.documents?.categoryCert?.url || "N/A",
        pwdCert: application.documents?.pwdCert?.url || "N/A",
        allotmentLetter: application.documents?.allotmentLetter?.url || "N/A",
        feeReceipt: application.documents?.feeReceipt?.url || "N/A",
        appForm: application.documents?.appForm?.url || "N/A",

        // Metadata
        declarationAccepted: application.declarationAccepted ? "Yes" : "No",
        mailDeclaration: application.mailDeclaration ? "Yes" : "No",
        submittedAt: application.submittedAt
          ? new Date(application.submittedAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        createdAt: application.createdAt
          ? new Date(application.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      };

      worksheet.addRow(row);
    });

    // ============ Style the Header Row ============
    const headerRow = worksheet.getRow(1);
    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" }, // Dark blue
    };
    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    headerRow.height = 25;

    // Add borders to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FF1F4E78" } },
        left: { style: "thin", color: { argb: "FF1F4E78" } },
        bottom: { style: "thin", color: { argb: "FF1F4E78" } },
        right: { style: "thin", color: { argb: "FF1F4E78" } },
      };
    });

    // ============ Style Data Rows ============
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Alternate row colors
        if (rowNumber % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF5F9FF" }, // Light blue tint
            };
          });
        }

        // Align text for specific columns
        row.getCell("amount").alignment = { horizontal: "right" };
        row.getCell("marks12").alignment = { horizontal: "center" };
        row.getCell("twelfthPassingYear").alignment = { horizontal: "center" };
        row.getCell("declarationAccepted").alignment = { horizontal: "center" };
        row.getCell("mailDeclaration").alignment = { horizontal: "center" };
        row.getCell("physicallyChallenged").alignment = { horizontal: "center" };
        row.getCell("gender").alignment = { horizontal: "center" };
        row.getCell("category").alignment = { horizontal: "center" };
      }
    });

    // ============ Format Date Columns ============
    const dateColumns = ["dob", "paymentDate", "submittedAt", "createdAt"];
    dateColumns.forEach((key) => {
      const col = worksheet.getColumn(key);
      if (col) {
        col.alignment = { horizontal: "center" };
      }
    });

    // ============ Apply Number Format ============
    const amountCol = worksheet.getColumn("amount");
    if (amountCol) {
      amountCol.numFmt = "#,##0.00";
    }

    // ============ Freeze Header Row ============
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // ============ Enable Auto Filter ============
    worksheet.autoFilter = {
      from: "A1",
      to: {
        row: 1,
        column: worksheet.columnCount,
      },
    };

    // ============ Set Row Height ============
    worksheet.eachRow((row) => {
      row.height = 20;
    });

    // ============ Set Response Headers ============
    const filename = `B.Tech_Applications_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Cache-Control", "no-cache");

    // ============ Write Workbook to Response ============
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Excel download error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download Excel file",
      error: error.message,
    });
  }
};


//assigning api logic

export const assignApplications = async (req, res) => {
  try {
    const { applicationIds, subAdminId } = req.body;

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one application.",
      });
    }

    // Check whether the selected sub-admin exists
    const subAdmin = await AdminUser.findOne({
      _id: subAdminId,
      role: "subAdmin",
      isActive: true,
      createdBy: req.user._id, // ensures admin can only assign to their own sub-admins
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found.",
      });
    }

    await FormsBtech.updateMany(
      {
        _id: { $in: applicationIds },
      },
      {
        $set: {
          "assignment.assignedTo": subAdmin._id,
          "assignment.assignedBy": req.user._id,
          "assignment.assignedAt": new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Applications assigned successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//api for subAdmin to get all applications that is assigned to him
export const getAssignedApplications = async (req, res) => {
  try {
    const applications = await UserBtech.find({
      "assignment.assignedTo": req.user._id,
    });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// mtech get form status

export const getFormStatus = async (req, res) => {
  try {
    const settings = await FormSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Form settings not found.",
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

export const toggleFormStatus = async (req, res) => {
  try {
    const settings = await FormSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Form settings not found.",
      });
    }

    settings.isFormActive = !settings.isFormActive;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: settings.isFormActive
        ? "Admission Form Enabled Successfully."
        : "Admission Form Disabled Successfully.",
      isFormActive: settings.isFormActive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// btech form status
export const getBtechFormStatus = async (req, res) => {
  try {
    const settings = await BtechFormSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Form settings not found.",
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

export const toggleBtechFormStatus = async (req, res) => {
  try {
    const settings = await BtechFormSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Form settings not found.",
      });
    }

    settings.isFormActive = !settings.isFormActive;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: settings.isFormActive
        ? "Admission Form Enabled Successfully."
        : "Admission Form Disabled Successfully.",
      isFormActive: settings.isFormActive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


