// // counselor-router.js
// const express = require("express");
// const router = express.Router();
// const {
//   registerCounselor,
//   verifyOTP,
//   loginCounselor,
//   forgotPassword,
//   resetPassword,
//   submitApplication,
//   getProfile,
//   getFile,
//   getPendingApplications,
//   updateApplicationStatus,
// } = require("../controllers/counselor-controller");
// const { authMiddleware, validate } = require("../middlewares/counselor-middleware");
// const { registerSchema, loginSchema } = require("../validators/counselor-validator");

// router.post("/register", validate(registerSchema), registerCounselor);
// router.post("/verify-otp", verifyOTP);
// router.post("/login", validate(loginSchema), loginCounselor);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.post("/application", authMiddleware, submitApplication);
// router.get("/profile", authMiddleware, getProfile);
// router.get("/file/:fileId", authMiddleware, getFile);


// module.exports = router;

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
router.get("/file/:fileId", authMiddleware, getFile);

module.exports = router;