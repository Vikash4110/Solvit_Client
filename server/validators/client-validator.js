const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  gender: z.enum(["Male", "Female", "Other"], { message: "Invalid gender" }),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  email: z.string().email("Invalid email format"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits").optional(),
    })
    .optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  preferredLanguage: z.enum(["English", "Hindi", "Other"], { message: "Invalid language selection" }),
  otherLanguage: z.string().optional(),
  howHeardAboutUs: z
    .enum(["Google", "Social Media", "Friend/Referral", "Other"])
    .optional()
    .default(""),
  referralCode: z.string().optional().default(""),
  termsAccepted: z.boolean().refine((val) => val === true, { message: "You must accept the terms" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => !(data.preferredLanguage === "Other" && !data.otherLanguage), {
  message: "Other language must be specified",
  path: ["otherLanguage"],
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema };