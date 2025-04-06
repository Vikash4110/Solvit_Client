const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getPendingApplications,
  updateApplicationStatus,
  getFile, // New function for admin file access
} = require("../controllers/admin-controller");
const { adminAuthMiddleware } = require("../middlewares/admin-middleware");

router.post("/login", loginAdmin);
router.get("/pending-applications", adminAuthMiddleware, getPendingApplications);
router.post("/update-application-status", adminAuthMiddleware, updateApplicationStatus);
router.get("/file/:fileId", adminAuthMiddleware, getFile); // New route for admin file access

module.exports = router;