import express from "express";
import { loginAdmin ,getProfile,logoutAdmin, getBtechFormStatus, toggleBtechFormStatus, getUsers, createUser, updateUser, deleteUser} from "../controller/admin.js";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import { getAllApplications,downloadApplicationsExcel, getAllBtechApplications,downloadBtechApplicationsExcel,assignApplications,getAssignedApplications } from "../controller/admin.js";
import { getFormStatus,toggleFormStatus} from "../controller/admin.js";

import { deleteApplication } from "../controller/deletemtechApplication.js";
import { deleteApplications } from "../controller/deletemtechApplications.js";

import { deleteBtechApplication } from "../controller/deleteBtechApplication.js";
import { deleteBtechApplications } from "../controller/deleteBtechApplications.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/profile", auth, getProfile);

router.post("/logout", logoutAdmin);

router.post(
  "/users",
  auth,
  role("admin"),
  createUser
);

router.get(
  "/users",
  auth,
  role("admin"),
  getUsers
);

// Update User
router.patch(
  "/users/:id",
  auth,
  role("admin"),
  updateUser
);

// Delete User
router.delete(
  "/users/:id",
  auth,
  role("admin"),
  deleteUser
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
  "/btechApplications/download/excel",
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
  "/assigned-applications",
  auth,
  role(["subAdmin"]),
  getAssignedApplications
);

router.get(
  "/form-status",
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
  getBtechFormStatus
);

router.put(
  "/toggle-btech-form-status",
  auth,
  role("admin"),
  toggleBtechFormStatus
);

router.delete(
  "/application/:id",
  auth,
  role("admin"),
  deleteApplication
);

router.delete(
  "/applications",
  auth,
  role("admin"),
  deleteApplications
);

router.delete(
  "/btechApplication/:id",
  auth,
  role("admin"),
  deleteBtechApplication
);

router.delete(
  "/btechApplications",
  auth,
  role("admin"),
  deleteBtechApplications
);





export default router;