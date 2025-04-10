const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const counselorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    highestQualification: {
      type: String,
      enum: ["Master’s Degree", "Ph.D.", "Diploma", "Other"],
      required: true,
    },
    specialization: [
      {
        type: String,
        enum: [
          "Mental Health",
          "Career Counseling",
          "Relationship Counseling",
          "Life Coaching",
          "Financial Counseling",
          "Academic Counseling",
          "Health & Wellness",
          "Other",
        ],
        required: true,
      },
    ],
    dob: { type: Date },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
    },
    yearsOfExperience: { type: Number, min: 0 },
    isLicensed: { type: Boolean, default: false },
    licenseDetails: { number: String, issuingAuthority: String },
    certifications: [{ name: String, issuingInstitution: String, completionDate: Date }],
    availability: {
      weekdays: { type: Boolean, default: false },
      weekends: { type: Boolean, default: false },
      morning: { type: Boolean, default: false },
      afternoon: { type: Boolean, default: false },
      evening: { type: Boolean, default: false },
    },
    preferredSessionMode: [
      {
        type: String,
        enum: ["Video Call", "Chat", "Audio Call"],
      },
    ],
    pricing: {
      perSession: { type: Number, min: 0 },
      subscription: { type: Number, min: 0 },
      customPricing: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "UPI", "PayPal", "Other"],
    },
    bankDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
    },
    documents: {
      resume: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
      degreeCertificate: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
      licenseCertification: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
      governmentId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
    },
    bio: { type: String },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
    languages: [{ type: String }],
    role: { type: String, default: "counselor" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: null, // No default status until application is submitted
    },
  },
  { timestamps: true }
);

counselorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

counselorSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

counselorSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id, role: "counselor" }, process.env.JWT_KEY, { expiresIn: "24h" });
};

module.exports = mongoose.model("Counselor", counselorSchema);