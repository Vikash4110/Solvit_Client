// routes/admin-router.js
const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getPendingApplications,
  updateApplicationStatus,
} = require("../controllers/admin-controller");
const { adminAuthMiddleware } = require("../middlewares/admin-middleware");

router.post("/login", loginAdmin);
router.get("/pending-applications", adminAuthMiddleware, getPendingApplications);
router.post("/update-application-status", adminAuthMiddleware, updateApplicationStatus);

module.exports = router;