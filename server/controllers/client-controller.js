const Client = require("../models/client-model");
const Counselor = require("../models/counselor-model");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const { registerSchema } = require("../validators/client-validator");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("profilePicture");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerClient = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Uploaded file:", req.file ? req.file.originalname : "None");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error);
      res.status(400).json({ message: "File upload failed", error: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const processedBody = {
        ...req.body,
        termsAccepted: req.body.termsAccepted === "true",
        howHeardAboutUs: req.body.howHeardAboutUs || "",
      };

      console.log("Incoming registration data:", JSON.stringify(processedBody, null, 2));

      const validatedData = await registerSchema.parseAsync(processedBody);
      const { email } = validatedData;

      const existingClient = await Client.findOne({ $or: [{ email }, { username: validatedData.username }] });
      if (existingClient) {
        return res.status(400).json({ message: "Email or username already registered" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => resolve());
        });
      }

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);

      const tempClient = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      req.app.locals.tempClients = req.app.locals.tempClients || {};
      req.app.locals.tempClients[email] = tempClient;
      console.log("Stored tempClient:", JSON.stringify(tempClient, null, 2));

      res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === "ZodError") {
        const status = 422;
        const message = "Invalid input data";
        const extraDetails = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return res.status(status).json({ status, message, extraDetails });
      }
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempClients = req.app.locals.tempClients || {};
    const tempClient = tempClients[email];

    if (!tempClient || tempClient.otp !== otp || Date.now() > tempClient.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const client = new Client({
      fullName: tempClient.fullName,
      dob: tempClient.dob,
      gender: tempClient.gender,
      contactNumber: tempClient.contactNumber,
      email: tempClient.email,
      address: tempClient.address,
      username: tempClient.username,
      password: tempClient.password,
      preferredLanguage: tempClient.preferredLanguage,
      otherLanguage: tempClient.otherLanguage,
      howHeardAboutUs: tempClient.howHeardAboutUs,
      referralCode: tempClient.referralCode,
      termsAccepted: tempClient.termsAccepted,
      profilePicture: tempClient.profilePicture,
    });
    await client.save();
    const token = client.generateToken();

    delete req.app.locals.tempClients[email];
    res.status(201).json({ message: "Client registered successfully", token });
  } catch (error) {
    console.error("OTP verification error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ status: 400, message: "Validation failed", errors });
    }
    next(error);
  }
};

const loginClient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client || !(await client.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = client.generateToken();
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = generateOTP();
    await sendEmail(email, "Password Reset OTP", `Your OTP to reset your password is: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ message: "OTP sent to your email for password reset." });
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];

    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.password = newPassword;
    await client.save();

    delete req.app.locals.resetOTPs[email];
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID in token" });
    }
    const client = await Client.findById(req.user.userId).select("-password");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    console.log("Fetched profile data:", JSON.stringify(client.toObject(), null, 2));
    res.json(client);
  } catch (error) {
    console.error("Profile fetch error:", error);
    next(error);
  }
};

const getFile = async (req, res, next) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gfs.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", file[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error("File fetch error:", error);
    next(error);
  }
};

const findCounselors = async (req, res, next) => {
  try {
    const { search = "", specialization = "", language = "", sessionMode = "", _id } = req.query;

    const query = { status: "Approved" };
    if (_id) {
      query._id = _id;
    } else {
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
        ];
      }
      if (specialization) query.specialization = { $in: [specialization] };
      if (language) query.languages = { $in: [language] };
      if (sessionMode) query.preferredSessionMode = { $in: [sessionMode] };
    }

    const counselors = await Counselor.find(query)
      .select(
        "fullName specialization languages preferredSessionMode yearsOfExperience profilePicture email gender dob highestQualification isLicensed licenseDetails pricing paymentMethod bio availability"
      )
      .lean();

    res.json(counselors);
  } catch (error) {
    console.error("Find counselors error:", error);
    next(error);
  }
};
// New function to fetch counselor profile pictures for clients
const getCounselorFile = async (req, res, next) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Optional: Verify the file belongs to a counselor
    const counselor = await Counselor.findOne({ profilePicture: fileId });
    if (!counselor) {
      return res.status(403).json({ message: "File not associated with any counselor" });
    }

    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", file[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error("Counselor file fetch error:", error);
    next(error);
  }
};

module.exports = {
  registerClient,
  verifyOTP,
  loginClient,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  findCounselors,
  getCounselorFile
};