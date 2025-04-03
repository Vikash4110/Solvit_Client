// controllers/admin-controller.js
const Counselor = require("../models/counselor-model");
const Admin = require("../models/admin-model");
const { sendEmail } = require("../utils/email");

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = admin.generateToken();
    res.json({ message: "Admin login successful", token });
  } catch (error) {
    next(error);
  }
};

const getPendingApplications = async (req, res, next) => {
  try {
    const pendingApplications = await Counselor.find({ status: "Pending" }).select("-password");
    res.json(pendingApplications);
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { counselorId, status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    counselor.status = status;
    await counselor.save();

    await sendEmail(
      counselor.email,
      `Application ${status}`,
      `Your application has been ${status.toLowerCase()} by the admin. ${
        status === "Approved"
          ? "You can now log in and start offering services."
          : "Please contact support for more details."
      }`
    );

    res.json({ message: `Application ${status} successfully` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  getPendingApplications,
  updateApplicationStatus,
};