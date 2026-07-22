import express from "express";
import { loginAdmin ,getProfile,logoutAdmin,createAdminUser} from "../controller/admin.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import { getAllApplications,downloadApplicationsExcel } from "../controller/admin.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/profile", auth, getProfile);

router.post("/logout", logoutAdmin);

router.post(
  "/create-admin-user",
  auth,
  role("admin"),
  createAdminUser
);


router.get("/applications",auth,role("admin","subAdmin"),
getAllApplications);

router.get(
  "/applications/download/excel",
  auth,
  role("admin", "subAdmin"),
  downloadApplicationsExcel
);

export default router;