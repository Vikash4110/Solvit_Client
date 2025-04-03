// import React, { useState } from "react";
// import { useAuth } from "../Store/auth";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "sonner"; // Use sonner instead of react-toastify
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faEnvelope, faLock, faPhone, faVenusMars, faGraduationCap, faKey, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
// import { RotatingLines } from "react-loader-spinner";
// import { motion } from "framer-motion";
// import Img from "../assets/vecteezy_two-women-sitting-in-chairs-talking_57226176.png";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     gender: "",
//     highestQualification: "",
//     specialization: "",
//   });
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { storeTokenInLS } = useAuth();
//   const navigate = useNavigate();

//   const specializationOptions = [
//     "Mental Health",
//     "Career Counseling",
//     "Relationship Counseling",
//     "Life Coaching",
//     "Financial Counseling",
//     "Academic Counseling",
//     "Health & Wellness",
//     "Other",
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.specialization) {
//       toast.error("Please select a specialization.");
//       return;
//     }
//     setLoading(true);

//     console.log("Form data submitted:", JSON.stringify(formData, null, 2));

//     try {
//       const response = await fetch(`${backendUrl}/api/counselors/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, specialization: [formData.specialization] }),
//       });

//       const data = await response.json();
//       console.log("Backend response:", JSON.stringify(data, null, 2));

//       if (!response.ok) {
//         const errorMessage = data.extraDetails
//           ? data.extraDetails.includes("specialization")
//             ? "Invalid specialization selected. Please choose from the provided options."
//             : data.extraDetails
//           : data.message || "Registration failed";
//         throw new Error(errorMessage);
//       }

//       toast.success("OTP sent to your email. Please verify.");
//       setIsOtpSent(true);
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/counselors/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email, otp }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       storeTokenInLS(data.token);
//       toast.success("Registration successful! Redirecting to application...");
//       setTimeout(() => navigate("/counselor-application"), 2000);
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bgVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
//     },
//   };

//   const formVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10 overflow-hidden"
//       variants={bgVariants}
//       animate="animate"
//       style={{ backgroundSize: "200% 200%" }}
//     >
//       <motion.div
//         className="hidden lg:flex w-1/2 justify-center items-center"
//         initial={{ opacity: 0, x: -100 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <img src={Img} alt="Counselor Registration" className="w-3/4 h-auto object-contain" />
//       </motion.div>

//       <motion.div className="w-full lg:w-1/2 flex justify-center" variants={formVariants} initial="hidden" animate="visible">
//         <div className="w-full max-w-lg mx-auto text-center bg-white rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl border border-gray-100">
//           <motion.h2
//             className="text-4xl font-extrabold text-[#0f6f5c] mb-8 tracking-tight"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//           >
//             {isOtpSent ? "Verify Your Email" : "Counselor Registration"}
//           </motion.h2>

//           {!isOtpSent ? (
//             <form onSubmit={handleRegisterSubmit} className="space-y-6">
//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   placeholder=""
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                 />
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faUser} /> <span>Full Name</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder=""
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                 />
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faEnvelope} /> <span>Email Address</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder=""
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                   minLength={6}
//                 />
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faLock} /> <span>Password (min 6 characters)</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   placeholder=""
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                   pattern="\d{10}"
//                   title="Phone number must be 10 digits"
//                 />
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faPhone} /> <span>Phone Number (10 digits)</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faVenusMars} /> <span>Gender</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
//                 <select
//                   name="highestQualification"
//                   value={formData.highestQualification}
//                   onChange={handleInputChange}
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                 >
//                   <option value="">Select Qualification</option>
//                   <option value="Master’s Degree">Master’s Degree</option>
//                   <option value="Ph.D.">Ph.D.</option>
//                   <option value="Diploma">Diploma</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faGraduationCap} /> <span>Highest Qualification</span>
//                 </label>
//               </motion.div>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
//                 <select
//                   name="specialization"
//                   value={formData.specialization}
//                   onChange={handleInputChange}
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                 >
//                   <option value="">Select Specialization</option>
//                   {specializationOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faCheckSquare} /> <span>Specialization</span>
//                 </label>
//               </motion.div>

//               <motion.button
//                 type="submit"
//                 className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto flex justify-center items-center bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                 whileHover={{ scale: loading ? 1 : 1.05 }}
//                 whileTap={{ scale: loading ? 1 : 0.95 }}
//                 disabled={loading}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 1.0, duration: 0.5 }}
//               >
//                 {loading ? (
//                   <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
//                 ) : (
//                   "Register"
//                 )}
//               </motion.button>
//             </form>
//           ) : (
//             <form onSubmit={handleOtpSubmit} className="space-y-6">
//               <motion.p className="text-gray-600 text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
//                 Enter the 6-digit OTP sent to <span className="font-semibold">{formData.email}</span>.
//               </motion.p>

//               <motion.div className="relative h-12 w-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder=""
//                   className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-[#0f6f5c] shadow-md"
//                   required
//                   maxLength={6}
//                   pattern="\d{6}"
//                   title="OTP must be 6 digits"
//                 />
//                 <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#0f6f5c]">
//                   <FontAwesomeIcon icon={faKey} /> <span>OTP</span>
//                 </label>
//               </motion.div>

//               <motion.button
//                 type="submit"
//                 className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto flex justify-center items-center bg-gradient-to-r from-[#0f6f5c] to-teal-500 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//                 whileHover={{ scale: loading ? 1 : 1.05 }}
//                 whileTap={{ scale: loading ? 1 : 0.95 }}
//                 disabled={loading}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 {loading ? (
//                   <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </motion.button>
//             </form>
//           )}

//           <motion.div className="flex justify-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
//             <p className="text-sm text-gray-600">
//               Already registered?{" "}
//               <Link to="/counselor-login" className="text-[#0f6f5c] font-semibold hover:underline transition-all">
//                 Login here
//               </Link>
//             </p>
//           </motion.div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Register;   

import React, { useState } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaVenusMars,
  FaGraduationCap,
  FaKey,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaUserCircle
} from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    highestQualification: "",
    specialization: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const stepTitles = [
    "Personal Information",
    "Professional Details",
    "Email Verification"
  ];

  const stepIcons = [
    <FaUser className="text-teal-500" />,
    <FaGraduationCap className="text-teal-500" />,
    <FaKey className="text-teal-500" />
  ];

  const specializationOptions = [
    "Mental Health",
    "Career Counseling",
    "Relationship Counseling",
    "Life Coaching",
    "Financial Counseling",
    "Academic Counseling",
    "Health & Wellness",
    "Other",
  ];

  const qualificationOptions = [
    "Master's Degree",
    "Ph.D.",
    "Diploma",
    "Other"
  ];

  const genderOptions = [
    "Male",
    "Female",
    "Other"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.specialization) {
      toast.error("Please select a specialization.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/counselors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, specialization: [formData.specialization] }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.extraDetails
          ? data.extraDetails.includes("specialization")
            ? "Invalid specialization selected. Please choose from the provided options."
            : data.extraDetails
          : data.message || "Registration failed";
        throw new Error(errorMessage);
      }

      toast.success("OTP sent to your email. Please verify.");
      setIsOtpSent(true);
      setStep(3);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/counselors/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      storeTokenInLS(data.token);
      toast.success("Registration successful! Redirecting to application...");
      setTimeout(() => navigate("/counselor-application"), 2000);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FaUserCircle className="text-2xl" />
                Counselor Registration
              </h1>
              <p className="text-teal-100 mt-1">Join our platform to help others with your expertise</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaGraduationCap className="text-xl" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index < step ? 'text-teal-600' : 'text-gray-400'}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step > index + 1 ? 'bg-teal-100' : step === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'
                }`}>
                  {step > index + 1 ? <FaCheck className="text-teal-600" /> : stepIcons[index]}
                </div>
                <span className="text-xs font-medium text-center">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {stepIcons[step - 1]}
                {stepTitles[step - 1]}
              </h2>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaUser className="text-gray-500" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaEnvelope className="text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaLock className="text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password (min 6 characters)"
                      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaPhone className="text-gray-500" />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number (10 digits)"
                      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                      required
                      pattern="\d{10}"
                      title="Phone number must be 10 digits"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaVenusMars className="text-gray-500" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
                      required
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaGraduationCap className="text-gray-500" />
                    <select
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
                      required
                    >
                      <option value="">Select Highest Qualification</option>
                      {qualificationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaCheck className="text-gray-500" />
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
                      required
                    >
                      <option value="">Select Specialization</option>
                      {specializationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <FaEnvelope className="text-blue-500 text-3xl mx-auto mb-2" />
                    <h3 className="font-medium text-blue-800">Verify Your Email</h3>
                    <p className="text-blue-600 text-sm mt-1">
                      We've sent a verification code to <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                    <FaKey className="text-gray-500" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      title="OTP must be 6 digits"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaArrowLeft />
                    Back
                  </motion.button>
                )}
                {step < 2 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <FaArrowRight />
                  </motion.button>
                ) : step === 2 ? (
                  <motion.button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="20" visible={true} />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleOtpSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? "Verifying..." : "Verify & Complete"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-6">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Link to="/counselor-login" className="text-teal-600 font-semibold hover:underline transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;