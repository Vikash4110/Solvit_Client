// counselor-controller.js
const Counselor = require("../models/counselor-model");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFSBucket = require("gridfs-stream");
const { Readable } = require("stream");
const { applicationSchema } = require("../validators/counselor-validator");

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for streaming to GridFS
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "degreeCertificate", maxCount: 1 },
  { name: "licenseCertification", maxCount: 1 },
  { name: "governmentId", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

const registerCounselor = async (req, res, next) => {
  try {
    const counselor = new Counselor(req.body);
    await counselor.save();
    const token = counselor.generateToken();
    res.status(201).json({ message: "Counselor registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ status: 400, message: "Validation failed", errors });
    }
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

const submitApplication = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            console.error("Unknown upload error:", err);
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Uploaded files:", JSON.stringify(Object.keys(req.files || {}), null, 2));
          resolve();
        });
      });

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      const files = req.files || {};

      // Upload files to GridFS and collect their IDs
      const fileIds = {};
      for (const field of ["resume", "degreeCertificate", "licenseCertification", "governmentId", "profilePicture"]) {
        if (files[field] && files[field][0]) {
          const file = files[field][0];
          const uploadStream = gfs.openUploadStream(`${Date.now()}-${file.originalname}`);
          const bufferStream = Readable.from(file.buffer);

          await new Promise((resolve, reject) => {
            bufferStream.pipe(uploadStream)
              .on("error", (err) => {
                console.error(`Error uploading ${field}:`, err);
                reject(err);
              })
              .on("finish", () => {
                fileIds[field] = uploadStream.id;
                console.log(`Uploaded ${field} with ID:`, uploadStream.id);
                resolve();
              });
          });
        }
      }

      req.fileIds = fileIds; // Pass file IDs to next middleware
      next();
    } catch (error) {
      console.error("File upload failed:", error);
      res.status(400).json({ message: "File upload failed", error: error.message });
    }
  },
  (req, res, next) => {
    console.log("Raw req.body after multer:", JSON.stringify(req.body, null, 2));

    const parsedBody = {};
    for (const key in req.body) {
      const value = req.body[key];
      try {
        parsedBody[key] = JSON.parse(value);
      } catch {
        if (key === "yearsOfExperience") {
          parsedBody[key] = Number(value);
        } else if (key === "isLicensed") {
          parsedBody[key] = value === "true" || value === true;
        } else {
          parsedBody[key] = value;
        }
      }
    }
    req.body = parsedBody;
    console.log("Parsed req.body before validation:", JSON.stringify(req.body, null, 2));
    next();
  },
  async (req, res, next) => {
    try {
      const validatedData = await applicationSchema.parseAsync(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));

      const counselor = await Counselor.findById(req.user.userId);
      if (!counselor) {
        const error = new Error("Counselor not found");
        error.status = 404;
        throw error;
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
      await counselor.save();
      console.log("Saved counselor data:", JSON.stringify(counselor.toObject(), null, 2));

      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      if (error.name === "ZodError") {
        const status = 422;
        const message = "Fill the Input Properly";
        const extraDetails = error.errors.map(err => `${err.path.join(".")}: ${err.message}`).join(", ");
        console.log({ status, message, extraDetails });
        return res.status(status).json({ status, message, extraDetails });
      }
      console.error("Application error:", error);
      next(error);
    }
  },
];

const getProfile = async (req, res, next) => {
  try {
    const counselor = await Counselor.findById(req.user.userId).select("-password");
    if (!counselor) {
      const error = new Error("Counselor not found");
      error.status = 404;
      throw error;
    }
    console.log("Fetched profile data:", JSON.stringify(counselor.toObject(), null, 2));
    res.json(counselor);
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
      const error = new Error("File not found");
      error.status = 404;
      throw error;
    }

    res.set("Content-Type", file[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (error) {
    console.error("File fetch error:", error);
    next(error);
  }
};

module.exports = { registerCounselor, loginCounselor, submitApplication, getProfile, getFile };