import express from "express";
import { loginAdmin ,getProfile,logoutAdmin,createAdminUser, getBtechFormStatus, toggleBtechFormStatus} from "../controller/admin.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import { getAllApplications,downloadApplicationsExcel, getAllBtechApplications,downloadBtechApplicationsExcel,assignApplications,getSubAdmins,getAssignedApplications } from "../controller/admin.js";
import { getFormStatus,toggleFormStatus} from "../controller/admin.js";

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

router.get("/btechApplications",auth,role("admin","subAdmin"),
getAllBtechApplications);

router.get(
  "/btechapplications/download/excel",
  auth,
  role("admin", "subAdmin"),
  downloadBtechApplicationsExcel
);

router.post(
  "/assign-applications",
  auth,
  role(["admin"]),
  assignApplications
);

router.get(
  "/sub-admins",
  auth,
  role(["admin"]),
  getSubAdmins
);

router.get(
  "/assigned-applications",
  auth,
  role(["subAdmin"]),
  getAssignedApplications
);

router.get(
  "/form-status",
  auth,
  role("admin"),
  getFormStatus
);

router.put(
  "/toggle-form-status",
  auth,
  role("admin"),
  toggleFormStatus
);

router.get(
  "/btech-form-status",
  auth,
  role("admin"),
  getBtechFormStatus
);

router.put(
  "/toggle-btech-form-status",
  auth,
  role("admin"),
  toggleBtechFormStatus
);



export default router;