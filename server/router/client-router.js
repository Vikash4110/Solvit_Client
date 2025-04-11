const express = require("express");
const router = express.Router();
const {
  registerClient,
  verifyOTP,
  loginClient,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  findCounselors,
  getCounselorFile,
  sendRequest,
  getSentRequests,
  withdrawRequest,
  getConnectedCounselors
} = require("../controllers/client-controller");
const { authMiddleware, validate } = require("../middlewares/client-middleware");
const { registerSchema, loginSchema } = require("../validators/client-validator");

router.post("/register", registerClient);
router.post("/verify-otp", verifyOTP);
router.post("/login", validate(loginSchema), loginClient);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.get("/file/:fileId", authMiddleware, getFile);
router.get("/find-counselors", authMiddleware, findCounselors);
router.get("/counselor-file/:fileId", authMiddleware, getCounselorFile); 
router.post("/send-request", authMiddleware, sendRequest);
router.get("/sent-requests", authMiddleware, getSentRequests);
router.delete("/withdraw-request/:requestId", authMiddleware, withdrawRequest);
router.get("/connected-counselors", authMiddleware, getConnectedCounselors);
module.exports = router;