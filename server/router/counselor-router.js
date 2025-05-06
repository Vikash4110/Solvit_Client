const express = require("express");
const router = express.Router();
const {
  registerCounselor,
  verifyOTP,
  loginCounselor,
  forgotPassword,
  resetPassword,
  submitApplication,
  getProfile,
  getFile,
  getPendingRequests,
  respondRequest,
  getVerifiedCounselors,
  getConnectedClients
} = require("../controllers/counselor-controller");
const { authMiddleware, validate } = require("../middlewares/counselor-middleware");
const { registerSchema, loginSchema } = require("../validators/counselor-validator");

router.post("/register", validate(registerSchema), registerCounselor);
router.post("/verify-otp", verifyOTP);
router.post("/login", validate(loginSchema), loginCounselor);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/application", authMiddleware, submitApplication);
router.get("/profile", authMiddleware, getProfile);
router.get("/file/:fileId",  getFile);
router.get("/pending-requests", authMiddleware, getPendingRequests);
router.post("/respond-request", authMiddleware, respondRequest);
router.get("/connected-clients", authMiddleware, getConnectedClients);
// counselor-router.js
router.get("/verified-counselors", getVerifiedCounselors);
module.exports = router;