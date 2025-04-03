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
    <FontAwesomeIcon icon={faUser} className="text-teal-500" />,
    <FontAwesomeIcon icon={faPhone} className="text-teal-500" />,
    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-500" />,
    <FontAwesomeIcon icon={faLanguage} className="text-teal-500" />,
    <FontAwesomeIcon icon={faKey} className="text-teal-500" />
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
                <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
                Client Registration
              </h1>
              <p className="text-teal-100 mt-1">Join our platform to find the best services</p>
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
                className={`flex flex-col items-center ${index < step ? 'text-teal-600' : 'text-gray-400'}`}
                onClick={() => step > index + 1 && setStep(index + 1)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  step > index + 1 ? 'bg-teal-100' : step === index + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'
                }`}>
                  {step > index + 1 ? <FontAwesomeIcon icon={faCheck} className="text-teal-600" /> : stepIcons[index]}
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
                    icon={<FontAwesomeIcon icon={faImage} className="text-teal-500" />}
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
                      className="h-5 w-5 text-teal-600 mt-1"
                      required
                    />
                    <label className="text-gray-700 text-sm">
                      I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-3xl mx-auto mb-2" />
                    <h3 className="font-medium text-blue-800">Verify Your Email</h3>
                    <p className="text-blue-600 text-sm mt-1">
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
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
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
                    className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium ${
                      loading ? "opacity-70 cursor-not-allowed" : "hover:bg-teal-700"
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
              <Link to="/client-login" className="text-teal-600 font-semibold hover:underline transition-all">
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
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
    {icon}
    <input 
      {...props} 
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </div>
);

const SelectField = ({ icon, options, ...props }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
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
  <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-400 transition-all">
    <div className="flex items-center gap-3">
      <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-teal-600 text-white py-1 px-3 rounded-md hover:bg-teal-700 transition-all text-sm font-medium">
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
//   faUserCircle,
//   faExclamationCircle
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
//   const [errors, setErrors] = useState({});
//   const [errorStep, setErrorStep] = useState(null);
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
    
//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }

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

//   const validateStep = (stepNumber) => {
//     const newErrors = {};
//     let isValid = true;

//     if (stepNumber === 1) {
//       if (!formData.fullName.trim()) {
//         newErrors.fullName = "Full name is required";
//         isValid = false;
//       }
//       if (!formData.username.trim()) {
//         newErrors.username = "Username is required";
//         isValid = false;
//       }
//       if (!formData.email.trim()) {
//         newErrors.email = "Email is required";
//         isValid = false;
//       } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//         newErrors.email = "Email is invalid";
//         isValid = false;
//       }
//       if (!formData.password) {
//         newErrors.password = "Password is required";
//         isValid = false;
//       } else if (formData.password.length < 6) {
//         newErrors.password = "Password must be at least 6 characters";
//         isValid = false;
//       }
//       if (!formData.confirmPassword) {
//         newErrors.confirmPassword = "Please confirm your password";
//         isValid = false;
//       } else if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Passwords do not match";
//         isValid = false;
//       }
//     }

//     if (stepNumber === 2) {
//       if (!formData.contactNumber) {
//         newErrors.contactNumber = "Contact number is required";
//         isValid = false;
//       } else if (!/^\d{10}$/.test(formData.contactNumber)) {
//         newErrors.contactNumber = "Contact number must be 10 digits";
//         isValid = false;
//       }
//       if (!formData.gender) {
//         newErrors.gender = "Gender is required";
//         isValid = false;
//       }
//       if (!formData.dob) {
//         newErrors.dob = "Date of birth is required";
//         isValid = false;
//       }
//     }

//     if (stepNumber === 3) {
//       if (!formData.address.street.trim()) {
//         newErrors["address.street"] = "Street is required";
//         isValid = false;
//       }
//       if (!formData.address.city.trim()) {
//         newErrors["address.city"] = "City is required";
//         isValid = false;
//       }
//       if (!formData.address.state.trim()) {
//         newErrors["address.state"] = "State is required";
//         isValid = false;
//       }
//       if (!formData.address.postalCode.trim()) {
//         newErrors["address.postalCode"] = "Postal code is required";
//         isValid = false;
//       } else if (!/^\d{5,6}$/.test(formData.address.postalCode)) {
//         newErrors["address.postalCode"] = "Postal code must be 5-6 digits";
//         isValid = false;
//       }
//     }

//     if (stepNumber === 4) {
//       if (!formData.preferredLanguage) {
//         newErrors.preferredLanguage = "Preferred language is required";
//         isValid = false;
//       } else if (formData.preferredLanguage === "Other" && !formData.otherLanguage.trim()) {
//         newErrors.otherLanguage = "Please specify your language";
//         isValid = false;
//       }
//       if (!formData.howHeardAboutUs) {
//         newErrors.howHeardAboutUs = "This field is required";
//         isValid = false;
//       }
//       if (!formData.termsAccepted) {
//         newErrors.termsAccepted = "You must accept the terms";
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     if (!isValid) {
//       setErrorStep(stepNumber);
//       // Show the first error in toast
//       const firstErrorKey = Object.keys(newErrors)[0];
//       toast.error(newErrors[firstErrorKey]);
//     }
//     return isValid;
//   };

//   const handleNextStep = () => {
//     if (validateStep(step)) {
//       setStep(step + 1);
//       setErrorStep(null);
//     }
//   };

//   const handlePrevStep = () => {
//     setStep(step - 1);
//     setErrorStep(null);
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateStep(4)) return;

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
//     if (!otp || !/^\d{6}$/.test(otp)) {
//       setErrors({ otp: "Please enter a valid 6-digit OTP" });
//       toast.error("Please enter a valid 6-digit OTP");
//       return;
//     }

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
//       setErrors({ otp: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const InputField = ({ icon, name, ...props }) => (
//     <div className={`flex items-center gap-3 border rounded-lg p-3 transition-all ${
//       errors[name] 
//         ? "border-red-500 ring-2 ring-red-200 bg-red-50" 
//         : "border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500"
//     }`}>
//       <div className={`${errors[name] ? "text-red-500" : "text-gray-500"}`}>
//         {icon}
//       </div>
//       <div className="flex-1">
//         <input 
//           {...props} 
//           name={name}
//           className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
//         />
//         {errors[name] && (
//           <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//             <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
//             {errors[name]}
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   const SelectField = ({ icon, options, name, ...props }) => (
//     <div className={`flex items-center gap-3 border rounded-lg p-3 transition-all ${
//       errors[name] 
//         ? "border-red-500 ring-2 ring-red-200 bg-red-50" 
//         : "border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500"
//     }`}>
//       <div className={`${errors[name] ? "text-red-500" : "text-gray-500"}`}>
//         {icon}
//       </div>
//       <div className="flex-1">
//         <select 
//           {...props} 
//           name={name}
//           className="w-full focus:outline-none bg-transparent text-gray-700 appearance-none"
//         >
//           <option value="">{props.placeholder}</option>
//           {options.map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//         {errors[name] && (
//           <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//             <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
//             {errors[name]}
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   const FileUpload = ({ icon, label, name, onChange, fileName }) => (
//     <div className={`border rounded-lg p-4 transition-all ${
//       errors[name] 
//         ? "border-red-500 ring-2 ring-red-200 bg-red-50" 
//         : "border-dashed border-gray-300 hover:border-teal-400"
//     }`}>
//       <div className="flex items-center gap-3">
//         <div className={`p-2 rounded-lg ${
//           errors[name] ? "bg-red-100 text-red-500" : "bg-teal-50 text-teal-600"
//         }`}>
//           {icon}
//         </div>
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//           <div className="flex items-center gap-3">
//             <label className={`cursor-pointer py-1 px-3 rounded-md transition-all text-sm font-medium ${
//               errors[name] 
//                 ? "bg-red-500 text-white hover:bg-red-600" 
//                 : "bg-teal-600 text-white hover:bg-teal-700"
//             }`}>
//               Choose File
//               <input 
//                 type="file" 
//                 name={name}
//                 onChange={onChange}
//                 className="hidden" 
//               />
//             </label>
//             {fileName && (
//               <span className="text-sm text-gray-600 truncate">{fileName}</span>
//             )}
//           </div>
//           {errors[name] && (
//             <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//               <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
//               {errors[name]}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

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
//                 Client Registration
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
//                 className={`flex flex-col items-center ${
//                   errorStep === index + 1 && Object.keys(errors).length > 0
//                     ? "text-red-500"
//                     : index + 1 < step
//                       ? 'text-teal-600'
//                       : index + 1 === step
//                         ? 'text-teal-600'
//                         : 'text-gray-400'
//                 }`}
//                 onClick={() => step > index + 1 && setStep(index + 1)}
//               >
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
//                   index + 1 < step
//                     ? 'bg-teal-100'
//                     : index + 1 === step
//                       ? errorStep === index + 1 && Object.keys(errors).length > 0
//                         ? 'bg-red-100 text-red-500'
//                         : 'bg-teal-600 text-white'
//                       : 'bg-gray-100'
//                 }`}>
//                   {index + 1 < step ? (
//                     <FontAwesomeIcon icon={faCheck} className="text-teal-600" />
//                   ) : (
//                     stepIcons[index]
//                   )}
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
//                     icon={<FontAwesomeIcon icon={faUser} />}
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Full Name"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faUser} />}
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     placeholder="Username"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faEnvelope} />}
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="Email Address"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faLock} />}
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     placeholder="Password (min 6 characters)"
//                     required
//                     minLength={6}
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faLock} />}
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
//                     icon={<FontAwesomeIcon icon={faPhone} />}
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
//                     icon={<FontAwesomeIcon icon={faVenusMars} />}
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     options={["Male", "Female", "Other"]}
//                     placeholder="Select Gender"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faCalendar} />}
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     placeholder="Date of Birth"
//                     required
//                   />
//                   <FileUpload
//                     icon={<FontAwesomeIcon icon={faImage} />}
//                     label="Profile Picture"
//                     name="profilePicture"
//                     onChange={handleInputChange}
//                     fileName={formData.profilePicture?.name}
//                   />
//                 </div>
//               )}

//               {step === 3 && (
//                 <div className="space-y-4">
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
//                     type="text"
//                     name="address.street"
//                     value={formData.address.street}
//                     onChange={handleInputChange}
//                     placeholder="Street"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
//                     type="text"
//                     name="address.city"
//                     value={formData.address.city}
//                     onChange={handleInputChange}
//                     placeholder="City"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
//                     type="text"
//                     name="address.state"
//                     value={formData.address.state}
//                     onChange={handleInputChange}
//                     placeholder="State"
//                     required
//                   />
//                   <InputField
//                     icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
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
//                     icon={<FontAwesomeIcon icon={faLanguage} />}
//                     name="preferredLanguage"
//                     value={formData.preferredLanguage}
//                     onChange={handleInputChange}
//                     options={["English", "Hindi", "Other"]}
//                     placeholder="Preferred Language"
//                     required
//                   />
//                   {formData.preferredLanguage === "Other" && (
//                     <InputField
//                       icon={<FontAwesomeIcon icon={faLanguage} />}
//                       type="text"
//                       name="otherLanguage"
//                       value={formData.otherLanguage}
//                       onChange={handleInputChange}
//                       placeholder="Other Language"
//                       required={formData.preferredLanguage === "Other"}
//                     />
//                   )}
//                   <SelectField
//                     icon={<FontAwesomeIcon icon={faQuestionCircle} />}
//                     name="howHeardAboutUs"
//                     value={formData.howHeardAboutUs}
//                     onChange={handleInputChange}
//                     options={["Google", "Social Media", "Friend/Referral", "Other"]}
//                     placeholder="How Did You Hear About Us?"
//                     required
//                   />
//                   <div className={`flex items-start gap-3 p-3 rounded-lg ${
//                     errors.termsAccepted ? "bg-red-50 border border-red-500" : "bg-gray-50"
//                   }`}>
//                     <input
//                       type="checkbox"
//                       name="termsAccepted"
//                       checked={formData.termsAccepted}
//                       onChange={handleInputChange}
//                       className={`h-5 w-5 mt-1 ${
//                         errors.termsAccepted ? "text-red-500" : "text-teal-600"
//                       }`}
//                       required
//                     />
//                     <label className="text-gray-700 text-sm">
//                       I agree to the <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
//                       {errors.termsAccepted && (
//                         <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                           <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
//                           {errors.termsAccepted}
//                         </p>
//                       )}
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
//                   <div className={`flex items-center gap-3 border rounded-lg p-3 transition-all ${
//                     errors.otp 
//                       ? "border-red-500 ring-2 ring-red-200 bg-red-50" 
//                       : "border-gray-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500"
//                   }`}>
//                     <div className={`${errors.otp ? "text-red-500" : "text-gray-500"}`}>
//                       <FontAwesomeIcon icon={faKey} />
//                     </div>
//                     <div className="flex-1">
//                       <input 
//                         type="text"
//                         value={otp}
//                         onChange={(e) => {
//                           setOtp(e.target.value);
//                           if (errors.otp) setErrors(prev => ({ ...prev, otp: undefined }));
//                         }}
//                         placeholder="Enter 6-digit OTP"
//                         required
//                         maxLength={6}
//                         pattern="\d{6}"
//                         className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 text-center"
//                       />
//                       {errors.otp && (
//                         <p className="text-red-500 text-xs mt-1 flex items-center gap-1 justify-center">
//                           <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" />
//                           {errors.otp}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-between gap-4 pt-4">
//                 {step > 1 && step < 5 && (
//                   <motion.button
//                     type="button"
//                     onClick={handlePrevStep}
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
//                     onClick={handleNextStep}
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

// export default ClientRegister;