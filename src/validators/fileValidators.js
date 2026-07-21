const validateFiles = (req, res, next) => {

    const files = req.files;

    if (!files) {

        return res.status(400).json({
            success: false,
            message: "Please upload all required documents."
        });

    }

    const requiredFiles = [

        "passportPhoto",

        "tenthMarksheet",

        "twelfthMarksheet",

        "aadhaarCard",

        "btechMarksheet",

        "gateScoreCard",

        "feeReceipt",

        "applicationForm"

    ];

    for (const file of requiredFiles) {

        if (!files[file] || files[file].length === 0) {

            return res.status(400).json({
                success: false,
                message: `${file} is required.`
            });

        }

    }

    // Category Certificate required only if category is not General

    if (

        req.body.category !== "General" &&

        (!files.categoryCertificate ||
            files.categoryCertificate.length === 0)

    ) {

        return res.status(400).json({

            success: false,

            message: "Category Certificate is required."

        });

    }

    next();

};

export default validateFiles;