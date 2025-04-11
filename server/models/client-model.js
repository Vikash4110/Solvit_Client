const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    address: {
      street: { type: String, required: true }, // Now required
      city: { type: String, required: true },   // Now required
      state: { type: String, required: true },  // Now required
      postalCode: { type: String, required: true }, // Now required
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferredLanguage: { type: String, enum: ["English", "Hindi", "Other"], required: true },
    otherLanguage: { type: String, default: "" },
    howHeardAboutUs: {
      type: String,
      enum: ["Google", "Social Media", "Friend/Referral", "Other"],
      required: true, // Already required in your frontend validation
    },
    referralCode: { type: String, default: "" },
    termsAccepted: { type: Boolean, required: true },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
    role: { type: String, default: "client" },
    connectedCounselors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Counselor" }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "ConnectionRequest" }],
  },
  { timestamps: true }
);

clientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

clientSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

clientSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, role: "client" },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("Client", clientSchema);