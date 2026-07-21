import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder) => {

    const result = await cloudinary.uploader.upload(

        filePath,

        {

            folder

        }

    );

    await fs.promises.unlink(filePath);

    return {

        url: result.secure_url,

        public_id: result.public_id

    };

};

export default uploadToCloudinary;