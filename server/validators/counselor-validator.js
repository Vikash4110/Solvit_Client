// // counselor-validator.js
// const { z } = require("zod");

// const registerSchema = z.object({
//   fullName: z.string().min(1, "Full name is required"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
//   gender: z.enum(["Male", "Female", "Other"], { message: "Invalid gender" }),
//   highestQualification: z.enum(["Master’s Degree", "Ph.D.", "Diploma", "Other"], { message: "Invalid qualification" }),
//   specialization: z.array(z.enum([
//     "Mental Health", "Career Counseling", "Relationship Counseling", "Life Coaching",
//     "Financial Counseling", "Academic Counseling", "Health & Wellness", "Other"
//   ])).min(1, "At least one specialization is required"),
// });

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(1, "Password is required"),
// });

// const applicationSchema = z.object({
//   dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
//   address: z.object({
//     street: z.string().min(1, "Street is required"),
//     city: z.string().min(1, "City is required"),
//     state: z.string().min(1, "State is required"),
//     postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits"),
//   }),
//   yearsOfExperience: z.number().min(0, "Years of experience cannot be negative"),
//   isLicensed: z.boolean(),
//   licenseDetails: z.object({
//     number: z.string().optional(),
//     issuingAuthority: z.string().optional(),
//   }).optional(),
//   certifications: z.array(z.object({
//     name: z.string(),
//     issuingInstitution: z.string(),
//     completionDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
//   })).optional(),
//   availability: z.object({
//     weekdays: z.boolean(),
//     weekends: z.boolean(),
//     morning: z.boolean(),
//     afternoon: z.boolean(),
//     evening: z.boolean(),
//   }),
//   preferredSessionMode: z.array(z.enum(["Video Call", "Chat", "Audio Call"])).min(1, "At least one session mode is required"),
//   pricing: z.object({
//     perSession: z.number().min(0).optional(),
//     subscription: z.number().min(0).optional(),
//     customPricing: z.string().optional(),
//   }),
//   paymentMethod: z.enum(["Bank Transfer", "UPI", "PayPal", "Other"], { message: "Invalid payment method" }),
//   bankDetails: z.object({
//     accountHolderName: z.string(),
//     bankName: z.string(),
//     accountNumber: z.string(),
//     ifscCode: z.string(),
//   }),
//   bio: z.string().min(10, "Bio must be at least 10 characters"),
//   languages: z.array(z.string()).min(1, "At least one language is required"),
// });

// module.exports = { registerSchema, loginSchema, applicationSchema };

const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Invalid gender" }),
  highestQualification: z.enum(["Master’s Degree", "Ph.D.", "Diploma", "Other"], { message: "Invalid qualification" }),
  specialization: z.array(
    z.enum([
      "Mental Health",
      "Career Counseling",
      "Relationship Counseling",
      "Life Coaching",
      "Financial Counseling",
      "Academic Counseling",
      "Health & Wellness",
      "Other",
    ])
  ).min(1, "At least one specialization is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const applicationSchema = z.object({
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits"),
  }),
  yearsOfExperience: z.number().min(0, "Years of experience cannot be negative"),
  isLicensed: z.boolean(),
  licenseDetails: z.object({
    number: z.string().optional(),
    issuingAuthority: z.string().optional(),
  }).optional(),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    morning: z.boolean(),
    afternoon: z.boolean(),
    evening: z.boolean(),
  }),
  preferredSessionMode: z.array(z.enum(["Video Call", "Chat", "Audio Call"])).min(1, "At least one session mode is required"),
  pricing: z.object({
    perSession: z.number().min(0).optional(),
    subscription: z.number().min(0).optional(),
    customPricing: z.string().optional(),
  }),
  paymentMethod: z.enum(["Bank Transfer", "UPI", "PayPal", "Other"], { message: "Invalid payment method" }),
  bankDetails: z.object({
    accountHolderName: z.string(),
    bankName: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
  }),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
});

module.exports = { registerSchema, loginSchema, applicationSchema };