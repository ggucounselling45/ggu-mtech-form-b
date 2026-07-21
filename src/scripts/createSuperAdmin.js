import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {

    await connectDB();

    const existingAdmin = await AdminUser.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Super Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "AAdmin@123",
      10
    );

    await AdminUser.create({
      name: "Super Admin",

      email: "jaanhvi@gmail.com",

      password: hashedPassword,

      role: "admin",
    });

    console.log("Super Admin Created Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

createSuperAdmin();