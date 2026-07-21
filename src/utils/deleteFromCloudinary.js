import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId) => {

    await cloudinary.uploader.destroy(publicId);

};

export default deleteFromCloudinary;