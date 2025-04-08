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
module.exports = router;