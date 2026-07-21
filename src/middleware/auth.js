import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";


const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Authorization denied, user not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
