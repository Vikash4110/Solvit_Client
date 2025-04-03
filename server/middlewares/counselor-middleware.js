// counselor-middleware.js
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role !== "counselor") throw new Error("Invalid role");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    const status = 422;
    const message = "Fill the Input Properly";
    const extraDetails = error.errors?.map(err => `${err.path.join(".")}: ${err.message}`).join(", ") || "Validation error";
    console.log({ status, message, extraDetails });
    res.status(status).json({ status, message, extraDetails });
  }
};

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const extraDetails = err.extraDetails || "An error occurred.";
  res.status(status).json({ status, message, extraDetails });
};

module.exports = { authMiddleware, validate, errorMiddleware };
