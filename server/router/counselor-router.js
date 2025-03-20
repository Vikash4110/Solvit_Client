// counselor-router.js
const express = require("express");
const router = express.Router();
const {
  registerCounselor,
  loginCounselor,
  submitApplication,
  getProfile,
  getFile,
} = require("../controllers/counselor-controller");
const { authMiddleware, validate } = require("../middlewares/counselor-middleware");
const { registerSchema, loginSchema } = require("../validators/counselor-validator");

router.post("/register", validate(registerSchema), registerCounselor);
router.post("/login", validate(loginSchema), loginCounselor);
router.post("/application", authMiddleware, submitApplication); // Validation is inside submitApplication
router.get("/profile", authMiddleware, getProfile);
router.get("/file/:fileId", authMiddleware, getFile);

module.exports = router;