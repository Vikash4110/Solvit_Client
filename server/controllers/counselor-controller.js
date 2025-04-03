// // counselor-controller.js
// const Counselor = require("../models/counselor-model");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const GridFSBucket = require("gridfs-stream");
// const { Readable } = require("stream");
// const { applicationSchema, registerSchema } = require("../validators/counselor-validator");
// const { sendEmail } = require("../utils/email");

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 },
// }).fields([
//   { name: "resume", maxCount: 1 },
//   { name: "degreeCertificate", maxCount: 1 },
//   { name: "licenseCertification", maxCount: 1 },
//   { name: "governmentId", maxCount: 1 },
//   { name: "profilePicture", maxCount: 1 },
// ]);

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const registerCounselor = async (req, res, next) => {
//   try {
//     console.log("Incoming registration data:", JSON.stringify(req.body, null, 2));

//     // Validate data against registerSchema
//     const validatedData = await registerSchema.parseAsync(req.body);
//     const { email } = validatedData;

//     const existingCounselor = await Counselor.findOne({ email });
//     if (existingCounselor) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const otp = generateOTP();
//     await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);

//     const tempCounselor = {
//       ...validatedData,
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
//     };

//     req.app.locals.tempCounselors = req.app.locals.tempCounselors || {};
//     req.app.locals.tempCounselors[email] = tempCounselor;
//     console.log("Stored tempCounselor:", JSON.stringify(tempCounselor, null, 2));

//     res.status(200).json({ message: "OTP sent to your email. Please verify." });
//   } catch (error) {
//     console.error("Registration error:", error);
//     if (error.name === "ZodError") {
//       const status = 422;
//       const message = "Invalid input data";
//       const extraDetails = error.errors
//         .map((err) => `${err.path.join(".")}: ${err.message}`)
//         .join(", ");
//       console.log("Validation error details:", { status, message, extraDetails });
//       return res.status(status).json({ status, message, extraDetails });
//     }
//     next(error);
//   }
// };

// const verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     const tempCounselors = req.app.locals.tempCounselors || {};
//     const tempCounselor = tempCounselors[email];

//     if (!tempCounselor || tempCounselor.otp !== otp || Date.now() > tempCounselor.expiresAt) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const counselor = new Counselor({
//       fullName: tempCounselor.fullName,
//       email: tempCounselor.email,
//       password: tempCounselor.password,
//       phoneNumber: tempCounselor.phoneNumber,
//       gender: tempCounselor.gender,
//       highestQualification: tempCounselor.highestQualification,
//       specialization: tempCounselor.specialization,
//     });
//     await counselor.save();
//     const token = counselor.generateToken();

//     delete req.app.locals.tempCounselors[email];
//     res.status(201).json({ message: "Counselor registered successfully", token });
//   } catch (error) {
//     console.error("OTP verification error:", error);
//     if (error.name === "ValidationError") {
//       const errors = Object.values(error.errors).map((err) => ({
//         field: err.path,
//         message: err.message,
//       }));
//       return res.status(400).json({ status: 400, message: "Validation failed", errors });
//     }
//     next(error);
//   }
// };

// const loginCounselor = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const counselor = await Counselor.findOne({ email });
//     if (!counselor || !(await counselor.comparePassword(password))) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }
//     const token = counselor.generateToken();
//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     next(error);
//   }
// };

// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const counselor = await Counselor.findOne({ email });
//     if (!counselor) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     const otp = generateOTP();
//     await sendEmail(
//       email,
//       "Password Reset OTP",
//       `Your OTP to reset your password is: ${otp}`
//     );

//     req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
//     req.app.locals.resetOTPs[email] = {
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//     };

//     res.status(200).json({ message: "OTP sent to your email for password reset." });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     next(error);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const resetOTPs = req.app.locals.resetOTPs || {};
//     const resetData = resetOTPs[email];

//     if (
//       !resetData ||
//       resetData.otp !== otp ||
//       Date.now() > resetData.expiresAt
//     ) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     const counselor = await Counselor.findOne({ email });
//     if (!counselor) {
//       return res.status(404).json({ message: "Counselor not found" });
//     }

//     counselor.password = newPassword;
//     await counselor.save();

//     delete req.app.locals.resetOTPs[email];
//     res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     next(error);
//   }
// };

// const submitApplication = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         upload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             console.error("Multer error:", err);
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             console.error("Unknown upload error:", err);
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Uploaded files:", JSON.stringify(Object.keys(req.files || {}), null, 2));
//           resolve();
//         });
//       });

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: "uploads",
//       });
//       const files = req.files || {};

//       const fileIds = {};
//       for (const field of [
//         "resume",
//         "degreeCertificate",
//         "licenseCertification",
//         "governmentId",
//         "profilePicture",
//       ]) {
//         if (files[field] && files[field][0]) {
//           const file = files[field][0];
//           const uploadStream = gfs.openUploadStream(`${Date.now()}-${file.originalname}`);
//           const bufferStream = Readable.from(file.buffer);

//           await new Promise((resolve, reject) => {
//             bufferStream
//               .pipe(uploadStream)
//               .on("error", (err) => {
//                 console.error(`Error uploading ${field}:`, err);
//                 reject(err);
//               })
//               .on("finish", () => {
//                 fileIds[field] = uploadStream.id;
//                 console.log(`Uploaded ${field} with ID:`, uploadStream.id);
//                 resolve();
//               });
//           });
//         }
//       }

//       req.fileIds = fileIds;
//       next();
//     } catch (error) {
//       console.error("File upload failed:", error);
//       res.status(400).json({ message: "File upload failed", error: error.message });
//     }
//   },
//   (req, res, next) => {
//     console.log("Raw req.body after multer:", JSON.stringify(req.body, null, 2));

//     const parsedBody = {};
//     for (const key in req.body) {
//       const value = req.body[key];
//       try {
//         parsedBody[key] = JSON.parse(value);
//       } catch {
//         if (key === "yearsOfExperience") {
//           parsedBody[key] = Number(value);
//         } else if (key === "isLicensed") {
//           parsedBody[key] = value === "true" || value === true;
//         } else {
//           parsedBody[key] = value;
//         }
//       }
//     }
//     req.body = parsedBody;
//     console.log("Parsed req.body before validation:", JSON.stringify(req.body, null, 2));
//     next();
//   },
//   async (req, res, next) => {
//     try {
//       const validatedData = await applicationSchema.parseAsync(req.body);
//       console.log("Validated data:", JSON.stringify(validatedData, null, 2));

//       const counselor = await Counselor.findById(req.user.userId);
//       if (!counselor) {
//         const error = new Error("Counselor not found");
//         error.status = 404;
//         throw error;
//       }

//       const fileIds = req.fileIds || {};
//       const documents = {
//         resume: fileIds.resume || counselor.documents?.resume,
//         degreeCertificate: fileIds.degreeCertificate || counselor.documents?.degreeCertificate,
//         licenseCertification: fileIds.licenseCertification || counselor.documents?.licenseCertification,
//         governmentId: fileIds.governmentId || counselor.documents?.governmentId,
//       };
//       counselor.documents = documents;
//       counselor.profilePicture = fileIds.profilePicture || counselor.profilePicture;

//       Object.assign(counselor, validatedData);
//       await counselor.save();
//       console.log("Saved counselor data:", JSON.stringify(counselor.toObject(), null, 2));

//       res.json({ message: "Application submitted successfully" });
//     } catch (error) {
//       if (error.name === "ZodError") {
//         const status = 422;
//         const message = "Fill the Input Properly";
//         const extraDetails = error.errors
//           .map((err) => `${err.path.join(".")}: ${err.message}`)
//           .join(", ");
//         console.log({ status, message, extraDetails });
//         return res.status(status).json({ status, message, extraDetails });
//       }
//       console.error("Application error:", error);
//       next(error);
//     }
//   },
// ];

// const getProfile = async (req, res, next) => {
//   try {
//     const counselor = await Counselor.findById(req.user.userId).select("-password");
//     if (!counselor) {
//       const error = new Error("Counselor not found");
//       error.status = 404;
//       throw error;
//     }
//     console.log("Fetched profile data:", JSON.stringify(counselor.toObject(), null, 2));
//     res.json(counselor);
//   } catch (error) {
//     console.error("Profile fetch error:", error);
//     next(error);
//   }
// };

// const getFile = async (req, res, next) => {
//   try {
//     const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//       bucketName: "uploads",
//     });
//     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
//     const file = await gfs.find({ _id: fileId }).toArray();

//     if (!file || file.length === 0) {
//       const error = new Error("File not found");
//       error.status = 404;
//       throw error;
//     }

//     res.set("Content-Type", file[0].contentType || "application/octet-stream");
//     res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
//     gfs.openDownloadStream(fileId).pipe(res);
//   } catch (error) {
//     console.error("File fetch error:", error);
//     next(error);
//   }
// };

// module.exports = {
//   registerCounselor,
//   verifyOTP,
//   loginCounselor,
//   forgotPassword,
//   resetPassword,
//   submitApplication,
//   getProfile,
//   getFile,
// };

const Counselor = require("../models/counselor-model");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFSBucket = require("gridfs-stream");
const { Readable } = require("stream");
const { applicationSchema, registerSchema } = require("../validators/counselor-validator");
const { sendEmail } = require("../utils/email");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "licenseCertification", maxCount: 1 },
  { name: "governmentId", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerCounselor = async (req, res, next) => {
  try {
    const validatedData = await registerSchema.parseAsync(req.body);
    const { email } = validatedData;

    const existingCounselor = await Counselor.findOne({ email });
    if (existingCounselor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOTP();
    await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);

    const tempCounselor = {
      ...validatedData,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10-minute expiration
    };

    req.app.locals.tempCounselors = req.app.locals.tempCounselors || {};
    req.app.locals.tempCounselors[email] = tempCounselor;

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(422).json({
        message: "Invalid input data",
        extraDetails: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", "),
      });
    }
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempCounselors = req.app.locals.tempCounselors || {};
    const tempCounselor = tempCounselors[email];

    if (!tempCounselor || tempCounselor.otp !== otp || Date.now() > tempCounselor.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const counselor = new Counselor({
      fullName: tempCounselor.fullName,
      email: tempCounselor.email,
      password: tempCounselor.password,
      phoneNumber: tempCounselor.phoneNumber,
      gender: tempCounselor.gender,
      highestQualification: tempCounselor.highestQualification,
      specialization: tempCounselor.specialization,
    });
    await counselor.save();
    const token = counselor.generateToken();

    delete req.app.locals.tempCounselors[email];
    res.status(201).json({ message: "Counselor registered successfully", token });
  } catch (error) {
    next(error);
  }
};

const loginCounselor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const counselor = await Counselor.findOne({ email });
    if (!counselor || !(await counselor.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = counselor.generateToken();
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const counselor = await Counselor.findOne({ email });
    if (!counselor) {
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

    const counselor = await Counselor.findOne({ email });
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    counselor.password = newPassword;
    await counselor.save();

    delete req.app.locals.resetOTPs[email];
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

const submitApplication = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      const files = req.files || {};
      const fileIds = {};

      for (const field of ["resume", "degreeCertificate", "licenseCertification", "governmentId", "profilePicture"]) {
        if (files[field] && files[field][0]) {
          const file = files[field][0];
          const uploadStream = gfs.openUploadStream(`${Date.now()}-${file.originalname}`);
          const bufferStream = Readable.from(file.buffer);

          await new Promise((resolve, reject) => {
            bufferStream.pipe(uploadStream).on("error", reject).on("finish", () => {
              fileIds[field] = uploadStream.id;
              resolve();
            });
          });
        }
      }

      req.fileIds = fileIds;
      next();
    } catch (error) {
      res.status(400).json({ message: "File upload failed", error: error.message });
    }
  },
  (req, res, next) => {
    const parsedBody = {};
    for (const key in req.body) {
      try {
        parsedBody[key] = JSON.parse(req.body[key]);
      } catch {
        parsedBody[key] = req.body[key] === "true" ? true : req.body[key] === "false" ? false : Number(req.body[key]) || req.body[key];
      }
    }
    req.body = parsedBody;
    next();
  },
  async (req, res, next) => {
    try {
      const validatedData = await applicationSchema.parseAsync(req.body);

      const counselor = await Counselor.findById(req.user.userId);
      if (!counselor) {
        return res.status(404).json({ message: "Counselor not found" });
      }

      const fileIds = req.fileIds || {};
      const documents = {
        resume: fileIds.resume || counselor.documents?.resume,
        degreeCertificate: fileIds.degreeCertificate || counselor.documents?.degreeCertificate,
        licenseCertification: fileIds.licenseCertification || counselor.documents?.licenseCertification,
        governmentId: fileIds.governmentId || counselor.documents?.governmentId,
      };

      counselor.documents = documents;
      counselor.profilePicture = fileIds.profilePicture || counselor.profilePicture;
      Object.assign(counselor, validatedData);
      counselor.status = "Pending"; // Set status to Pending only on submission
      await counselor.save();

      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(422).json({
          message: "Fill the Input Properly",
          extraDetails: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", "),
        });
      }
      next(error);
    }
  },
];

const getProfile = async (req, res, next) => {
  try {
    const counselor = await Counselor.findById(req.user.userId).select("-password");
    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }
    res.json(counselor);
  } catch (error) {
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
    next(error);
  }
};

module.exports = {
  registerCounselor,
  verifyOTP,
  loginCounselor,
  forgotPassword,
  resetPassword,
  submitApplication,
  getProfile,
  getFile,
};