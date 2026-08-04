import BtechForm from "../models/UserBtech.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const deleteBtechApplications = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No applications selected.",
      });
    }

    const applications = await BtechForm.find({
      _id: { $in: ids },
    });

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Applications not found.",
      });
    }

    // Delete Cloudinary files
    for (const application of applications) {
      for (const key in application.documents) {
        const document = application.documents[key];

        if (document?.public_id) {
          await deleteFromCloudinary(document.public_id);
        }
      }
    }

    // Delete MongoDB documents
    await BtechForm.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: `${applications.length} applications deleted successfully.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};