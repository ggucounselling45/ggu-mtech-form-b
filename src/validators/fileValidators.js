const validateFiles = (req, res, next) => {
  const files = req.files;

  if (!files) {
    return res.status(400).json({
      success: false,
      message: "Please upload all required documents.",
    });
  }

  // Files required for everyone
  const requiredFiles = [
    "passportPhoto",
    "marksheet10",
    "marksheet12",
    "gateQualifyExam",
    "feeReceipt",
    "appForm",
  ];

  for (const file of requiredFiles) {
    if (!files[file] || files[file].length === 0) {
      return res.status(400).json({
        success: false,
        message: `${file} is required.`,
      });
    }
  }

  // GATE Scorecard required only if GATE Qualified = Yes
  if (
    req.body.gateQualified === "Yes" &&
    (!files.gateScorecard || files.gateScorecard.length === 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "GATE Scorecard is required.",
    });
  }

  // Category Certificate required only for reserved categories
  if (
    ["Gen-EWS", "OBC-NCL", "SC", "ST"].includes(req.body.category) &&
    (!files.categoryCert || files.categoryCert.length === 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Category Certificate is required.",
    });
  }

  // PWD Certificate required only if Physically Challenged = Yes
  if (
    req.body.physChallenged === "Yes" &&
    (!files.pwdCert || files.pwdCert.length === 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "PWD Certificate is required.",
    });
  }

  // Allotment Letter required only if already admitted
  if (
    req.body.admissionStatus === "Yes" &&
    (!files.allotmentLetter || files.allotmentLetter.length === 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Provisional Allotment Letter is required.",
    });
  }

  next();
};

export default validateFiles;