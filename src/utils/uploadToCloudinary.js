import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer); // 👈 pipes buffer directly to Cloudinary
  });
};

export default uploadToCloudinary;