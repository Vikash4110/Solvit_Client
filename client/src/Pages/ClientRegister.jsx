// import React, { useState } from "react";
// import { useAuth } from "../Store/auth";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faEnvelope,
//   faLock,
//   faPhone,
//   faVenusMars,
//   faCalendar,
//   faLanguage,
//   faKey,
//   faCheckSquare,
//   faImage,
//   faQuestionCircle,
//   faMapMarkerAlt,
//   faCheck,
//   faArrowLeft,
//   faArrowRight,
//   faUserCircle
// } from "@fortawesome/free-solid-svg-icons";
// import { RotatingLines } from "react-loader-spinner";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const ClientRegister = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     contactNumber: "",
//     gender: "",
//     dob: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       postalCode: "",
//     },
//     preferredLanguage: "",
//     otherLanguage: "",
//     howHeardAboutUs: "",
//     termsAccepted: false,
//     profilePicture: null,
//   });
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const { storeTokenInLS } = useAuth();
//   const navigate = useNavigate();

//   const stepTitles = [
//     "Personal Information",
//     "Contact Details",
//     "Address Information",
//     "Preferences",
//     "Verification"
//   ];

//   const stepIcons = [
//     <FontAwesomeIcon icon={faUser} className="text-teal-500" />,
//     <FontAwesomeIcon icon={faPhone} className="text-teal-500" />,
//     <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-500" />,
//     <FontAwesomeIcon icon={faLanguage} className="text-teal-500" />,
//     <FontAwesomeIcon icon={faKey} className="text-teal-500" />
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else if (type === "file") {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     } else if (name.startsWith("address.")) {
//       const addressField = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         address: { ...prev.address, [addressField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.termsAccepted) {
//       toast.error("You must accept the terms and conditions.");
//       return;
//     }
//     if (formData.preferredLanguage === "Other" && !formData.otherLanguage) {
//       toast.error("Please specify your other language.");
//       return;
//     }
//     if (!formData.howHeardAboutUs) {
//       toast.error("Please select how you heard about us.");
//       return;
//     }
//     if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.postalCode) {
//       toast.error("All address fields are required.");
//       return;
//     }
//     setLoading(true);

//     const data = new FormData();
//     for (const key in formData) {
//       if (key === "profilePicture" && formData[key]) {
//         data.append(key, formData[key]);
//       } else if (key === "address") {
//         data.append("address[street]", formData.address.street);
//         data.append("address[city]", formData.address.city);
//         data.append("address[state]", formData.address.state);
//         data.append("address[postalCode]", formData.address.postalCode);
//       } else {
//         data.append(key, formData[key]);
//       }
//     }

//     try {
//       const response = await fetch(`${backendUrl}/api/clients/register`, {
//         method: "POST",
//         body: data,
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.extraDetails || result.message || "Registration failed");
//       }

//       toast.success("OTP sent to your email. Please verify.");
//       setStep(5);
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
//       const response = await fetch(`${backendUrl}/api/clients/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email, otp }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       storeTokenInLS(data.token);
//       toast.success("Registration successful! Redirecting...");
//       setTimeout(() => navigate("/client-profile"), 2000);
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
//       <motion.div 
//         className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-teal-600 to-blue-500 p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold flex items-center gap-3">
//                 <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
//                Get Started Now
//               </h1>
//               <p className="text-teal-100 mt-1">Join our platform to find the best services</p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <FontAwesomeIcon icon={faUser} className="text-xl" />
//             </div>
//           </div>
//         </div>

//         {/* Progress Steps */}
//         <div className="px-6 pt-4 pb-2 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             {stepTitles.map((title, index) => (
//               <div 
//                 key={index} 
//                 className={`flex flex-col items-center ${index < step ? 'text-teal-600' : 'text-gray-400'}`}
//                 onClick={() => step > index + 1 && setStep(index + 1)}
//               >
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
//                   step > index + 1 ? 'bg-teal-100' : step === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'
//                 }`}>
//                   {step > index + 1 ? <FontAwesomeIcon icon={faCheck} className="text-teal-600" /> : stepIcons[index]}
//                 </div>
//                 <span className="text-xs font-medium text-center">{title}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="p-6">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={step}
//               initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
//               transition={{ duration: 0.3 }}
//               className="space-y-6"
//             >
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 {stepIcons[step - 1]}
//                 {stepTitles[step - 1]}
//               </h2>

//               {step === 1 && (
//                 <div className="space-y-4">
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Full Name"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     placeholder="Username"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />}
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="Email Address"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Password (min 6 characters)"
//                     required
//                     minLength={6}
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="Confirm Password"
//                     required
//                     minLength={6}
//                   />
//                 </div>
//               )}

//               {step === 2 && (
//                 <div className="space-y-4">
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faPhone} className="text-gray-500" />}
//                     type="text"
//                     name="contactNumber"
//                     value={formData.contactNumber}
//                     onChange={handleInputChange}
//                     placeholder="Contact Number (10 digits)"
//                     required
//                     pattern="\d{10}"
//                     title="Contact number must be 10 digits"
//                   />
//                   <SelectField
//                     icon={<FontAwesomeIcon icon={faVenusMars} className="text-gray-500" />}
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     options={["Male", "Female", "Other"]}
//                     placeholder="Select Gender"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faCalendar} className="text-gray-500" />}
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     placeholder="Date of Birth"
//                     required
//                   />
//                   <FileUpload
//                     icon={<FontAwesomeIcon icon={faImage} className="text-teal-500" />}
//                     label="Profile Picture"
//                     name="profilePicture"
//                     onChange={(e) => handleInputChange(e)}
//                     fileName={formData.profilePicture?.name}
//                   />
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="space-y-4">
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
//                     type="text"
//                     name="address.street"
//                     value={formData.address.street}
//                     onChange={handleInputChange}
//                     placeholder="Street"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
//                     type="text"
//                     name="address.city"
//                     value={formData.address.city}
//                     onChange={handleInputChange}
//                     placeholder="City"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
//                     type="text"
//                     name="address.state"
//                     value={formData.address.state}
//                     onChange={handleInputChange}
//                     placeholder="State"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
//                     type="text"
//                     name="address.postalCode"
//                     value={formData.address.postalCode}
//                     onChange={handleInputChange}
//                     placeholder="Postal Code (5-6 digits)"
//                     required
//                     pattern="\d{5,6}"
//                     title="Postal code must be 5 or 6 digits"
//                   />
//                 </div>
//               )}

//               {step === 4 && (
//                 <div className="space-y-4">
//                   <SelectField
//                     icon={<FontAwesomeIcon icon={faLanguage} className="text-gray-500" />}
//                     name="preferredLanguage"
//                     value={formData.preferredLanguage}
//                     onChange={handleInputChange}
//                     options={["English", "Hindi", "Other"]}
//                     placeholder="Preferred Language"
//                     required
//                   />
//                   {formData.preferredLanguage === "Other" && (
//                     <InputField
//                       icon={<FontAwesomeIcon icon={faLanguage} className="text-gray-500" />}
//                       type="text"
//                       name="otherLanguage"
//                       value={formData.otherLanguage}
//                       onChange={handleInputChange}
//                       placeholder="Other Language"
//                       required
//                     />
//                   )}
//                   <SelectField
//                     icon={<FontAwesomeIcon icon={faQuestionCircle} className="text-gray-500" />}
//                     name="howHeardAboutUs"
//                     value={formData.howHeardAboutUs}
//                     onChange={handleInputChange}
//                     options={["Google", "Social Media", "Friend/Referral", "Other"]}
//                     placeholder="How Did You Hear About Us?"
//                     required
//                   />
//                   <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                     <input
//                       type="checkbox"
//                       name="termsAccepted"
//                       checked={formData.termsAccepted}
//                       onChange={handleInputChange}
//                       className="h-5 w-5 text-teal-600 mt-1"
//                       required
//                     />
//                     <label className="text-gray-700 text-sm">
//                       I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
//                     </label>
//                   </div>
//                 </div>
//               )}

//               {step === 5 && (
//                 <div className="space-y-4 text-center">
//                   <div className="bg-blue-50 p-4 rounded-lg">
//                     <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-3xl mx-auto mb-2" />
//                     <h3 className="font-medium text-blue-800">Verify Your Email</h3>
//                     <p className="text-blue-600 text-sm mt-1">
//                       We've sent a verification code to <span className="font-medium">{formData.email}</span>
//                     </p>
//                   </div>
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faKey} className="text-gray-500" />}
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="Enter 6-digit OTP"
//                     required
//                     maxLength={6}
//                     pattern="\d{6}"
//                     title="OTP must be 6 digits"
//                   />
//                 </div>
//               )}

//               <div className="flex justify-between gap-4 pt-4">
//                 {step > 1 && (
//                   <motion.button
//                     type="button"
//                     onClick={() => setStep(step - 1)}
//                     className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <FontAwesomeIcon icon={faArrowLeft} />
//                     Back
//                   </motion.button>
//                 )}
//                 {step < 4 ? (
//                   <motion.button
//                     type="button"
//                     onClick={() => setStep(step + 1)}
//                     className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     Next
//                     <FontAwesomeIcon icon={faArrowRight} />
//                   </motion.button>
//                 ) : step === 4 ? (
//                   <motion.button
//                     type="button"
//                     onClick={handleRegisterSubmit}
//                     disabled={loading}
//                     className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
//                       loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
//                     } transition-all`}
//                     whileHover={{ scale: loading ? 1 : 1.02 }}
//                     whileTap={{ scale: loading ? 1 : 0.98 }}
//                   >
//                     {loading ? (
//                       <>
//                         <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
//                         Processing...
//                       </>
//                     ) : (
//                       "Complete Registration"
//                     )}
//                   </motion.button>
//                 ) : (
//                   <motion.button
//                     onClick={handleOtpSubmit}
//                     disabled={loading}
//                     className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
//                       loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
//                     } transition-all`}
//                     whileHover={{ scale: loading ? 1 : 1.02 }}
//                     whileTap={{ scale: loading ? 1 : 0.98 }}
//                   >
//                     {loading ? "Verifying..." : "Verify & Complete"}
//                   </motion.button>
//                 )}
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           <div className="flex justify-center mt-6">
//             <p className="text-sm text-gray-600">
//               Already registered?{" "}
//               <Link to="/client-login" className="text-teal-600 font-semibold hover:underline transition-all">
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // Reusable Components
// const InputField = ({ icon, ...props }) => (
//   <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
//     {icon}
//     <input 
//       {...props} 
//       className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
//     />
//   </div>
// );

// const SelectField = ({ icon, options, ...props }) => (
//   <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
//     {icon}
//     <select 
//       {...props} 
//       className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
//     >
//       <option value="">{props.placeholder}</option>
//       {options.map(option => (
//         <option key={option} value={option}>{option}</option>
//       ))}
//     </select>
//   </div>
// );

// const FileUpload = ({ icon, label, name, onChange, fileName }) => (
//   <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-400 transition-all">
//     <div className="flex items-center gap-3">
//       <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
//         {icon}
//       </div>
//       <div className="flex-1">
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <div className="flex items-center gap-3">
//           <label className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium">
//             Choose File
//             <input 
//               type="file" 
//               name={name}
//               onChange={onChange}
//               className="hidden" 
//             />
//           </label>
//           {fileName && (
//             <span className="text-sm text-gray-600 truncate">{fileName}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default ClientRegister;


import React, { useState } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faVenusMars,
  faCalendar,
  faLanguage,
  faKey,
  faCheckSquare,
  faImage,
  faQuestionCircle,
  faMapMarkerAlt,
  faCheck,
  faArrowLeft,
  faArrowRight,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClientRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    gender: "",
    dob: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    preferredLanguage: "",
    otherLanguage: "",
    howHeardAboutUs: "",
    termsAccepted: false,
    profilePicture: null,
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const stepTitles = [
    "Personal Information",
    "Contact Details",
    "Address Information",
    "Preferences",
    "Verification"
  ];

  const stepIcons = [
    <FontAwesomeIcon icon={faUser} className="text-black" />,
    <FontAwesomeIcon icon={faPhone} className="text-black" />,
    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-black" />,
    <FontAwesomeIcon icon={faLanguage} className="text-black" />,
    <FontAwesomeIcon icon={faKey} className="text-black" />
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }
    if (formData.preferredLanguage === "Other" && !formData.otherLanguage) {
      toast.error("Please specify your other language.");
      return;
    }
    if (!formData.howHeardAboutUs) {
      toast.error("Please select how you heard about us.");
      return;
    }
    if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.postalCode) {
      toast.error("All address fields are required.");
      return;
    }
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key === "profilePicture" && formData[key]) {
        data.append(key, formData[key]);
      } else if (key === "address") {
        data.append("address[street]", formData.address.street);
        data.append("address[city]", formData.address.city);
        data.append("address[state]", formData.address.state);
        data.append("address[postalCode]", formData.address.postalCode);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${backendUrl}/api/clients/register`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.extraDetails || result.message || "Registration failed");
      }

      toast.success("OTP sent to your email. Please verify.");
      setStep(5);
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
      const response = await fetch(`${backendUrl}/api/clients/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      storeTokenInLS(data.token);
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/client-profile"), 2000);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
                Get Started Now
              </h1>
              <p className="text-indigo-100 mt-1">Join our platform to find the best services</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index < step ? 'text-indigo-600' : 'text-gray-400'}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step > index + 1 ? 'bg-indigo-100' : step === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100'
                }`}>
                  {step > index + 1 ? <FontAwesomeIcon icon={faCheck} className="text-indigo-600" /> : stepIcons[index]}
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
                  <InputField
                    icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faUser} className="text-gray-500" />}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password (min 6 characters)"
                    required
                    minLength={6}
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faLock} className="text-gray-500" />}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FontAwesomeIcon icon={faPhone} className="text-gray-500" />}
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number (10 digits)"
                    required
                    pattern="\d{10}"
                    title="Contact number must be 10 digits"
                  />
                  <SelectField
                    icon={<FontAwesomeIcon icon={faVenusMars} className="text-gray-500" />}
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={["Male", "Female", "Other"]}
                    placeholder="Select Gender"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faCalendar} className="text-gray-500" />}
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    placeholder="Date of Birth"
                    required
                  />
                  <FileUpload
                    icon={<FontAwesomeIcon icon={faImage} className="text-indigo-600" />}
                    label="Profile Picture"
                    name="profilePicture"
                    onChange={(e) => handleInputChange(e)}
                    fileName={formData.profilePicture?.name}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <InputField
                    icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                  <InputField
                    icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500" />}
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code (5-6 digits)"
                    required
                    pattern="\d{5,6}"
                    title="Postal code must be 5 or 6 digits"
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <SelectField
                    icon={<FontAwesomeIcon icon={faLanguage} className="text-gray-500" />}
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    options={["English", "Hindi", "Other"]}
                    placeholder="Preferred Language"
                    required
                  />
                  {formData.preferredLanguage === "Other" && (
                    <InputField
                      icon={<FontAwesomeIcon icon={faLanguage} className="text-gray-500" />}
                      type="text"
                      name="otherLanguage"
                      value={formData.otherLanguage}
                      onChange={handleInputChange}
                      placeholder="Other Language"
                      required
                    />
                  )}
                  <SelectField
                    icon={<FontAwesomeIcon icon={faQuestionCircle} className="text-gray-500" />}
                    name="howHeardAboutUs"
                    value={formData.howHeardAboutUs}
                    onChange={handleInputChange}
                    options={["Google", "Social Media", "Friend/Referral", "Other"]}
                    placeholder="How Did You Hear About Us?"
                    required
                  />
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-indigo-600 mt-1"
                      required
                    />
                    <label className="text-gray-700 text-sm">
                      I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 text-center">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="text-indigo-600 text-3xl mx-auto mb-2" />
                    <h3 className="font-medium text-indigo-800">Verify Your Email</h3>
                    <p className="text-indigo-600 text-sm mt-1">
                      We've sent a verification code to <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>
                  <InputField
                    icon={<FontAwesomeIcon icon={faKey} className="text-gray-500" />}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    title="OTP must be 6 digits"
                  />
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
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </motion.button>
                )}
                {step < 4 ? (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} />
                  </motion.button>
                ) : step === 4 ? (
                  <motion.button
                    type="button"
                    onClick={handleRegisterSubmit}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
                    } transition-all`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="24" visible={true} />
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
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
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
              <Link to="/client-login" className="text-indigo-600 font-semibold hover:underline transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const InputField = ({ icon, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition-all">
    {icon}
    <input 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </div>
);

const SelectField = ({ icon, options, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-indigo-600 transition-all">
    {icon}
    <select 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
    >
      <option value="">{props.placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ icon, label, name, onChange, fileName }) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-600 transition-all">
    <div className="flex items-center gap-3">
      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700 transition-all text-sm font-medium">
            Choose File
            <input 
              type="file" 
              name={name}
              onChange={onChange}
              className="hidden" 
            />
          </label>
          {fileName && (
            <span className="text-sm text-gray-600 truncate">{fileName}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ClientRegister;
