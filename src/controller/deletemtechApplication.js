import Forms from "../models/User.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Forms.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Delete all uploaded documents
    for (const key in application.documents) {
      const document = application.documents[key];

      if (document?.public_id) {
        await deleteFromCloudinary(document.public_id);
      }
    }

    await Forms.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};