import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faGraduationCap,
  faCheckSquare,
  faMapMarkerAlt,
  faCalendarAlt,
  faBriefcase,
  faMoneyBillWave,
  faFileUpload,
  faChevronRight,
  faChevronLeft,
  faCloudUploadAlt,
  faIdCard,
  faFileAlt,
  faUniversity,
  faCertificate
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Application = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    highestQualification: "",
    specialization: [],
    dob: "",
    address: { street: "", city: "", state: "", postalCode: "" },
    yearsOfExperience: "",
    isLicensed: false,
    licenseDetails: { number: "", issuingAuthority: "" },
    availability: { weekdays: false, weekends: false, morning: false, afternoon: false, evening: false },
    preferredSessionMode: [],
    pricing: { perSession: "", subscription: "", customPricing: "" },
    paymentMethod: "",
    bankDetails: { accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "" },
    bio: "",
    languages: [],
  });
  
  const [files, setFiles] = useState({
    resume: null,
    degreeCertificate: null,
    licenseCertification: null,
    governmentId: null,
    profilePicture: null,
  });
  
  const [filePreviews, setFilePreviews] = useState({
    profilePicture: null,
  });
  
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: "Personal Details" },
    { number: 2, title: "Professional Info" },
    { number: 3, title: "Availability & Pricing" },
    { number: 4, title: "Documents Upload" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/counselors/profile`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        
        if (response.ok) {
          const profileData = await response.json();
          setStatus(profileData.status);

          if (profileData.status === "Approved") {
            navigate("/counselor-dashboard");
            return;
          }

          if (profileData.status === "Pending" || profileData.status === "Rejected") {
            return;
          }

          setFormData((prev) => ({
            ...prev,
            fullName: profileData.fullName || "",
            email: profileData.email || "",
            phoneNumber: profileData.phoneNumber || "",
            gender: profileData.gender || "",
            highestQualification: profileData.highestQualification || "",
            specialization: profileData.specialization || [],
            dob: profileData.dob ? new Date(profileData.dob).toISOString().split("T")[0] : "",
            address: profileData.address || { street: "", city: "", state: "", postalCode: "" },
            yearsOfExperience: profileData.yearsOfExperience?.toString() || "",
            isLicensed: profileData.isLicensed || false,
            licenseDetails: profileData.licenseDetails || { number: "", issuingAuthority: "" },
            availability: profileData.availability || {
              weekdays: false,
              weekends: false,
              morning: false,
              afternoon: false,
              evening: false,
            },
            preferredSessionMode: profileData.preferredSessionMode || [],
            pricing: profileData.pricing || { perSession: "", subscription: "", customPricing: "" },
            paymentMethod: profileData.paymentMethod || "",
            bankDetails: profileData.bankDetails || {
              accountHolderName: "",
              bankName: "",
              accountNumber: "",
              ifscCode: "",
            },
            bio: profileData.bio || "",
            languages: profileData.languages || [],
          }));
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile data");
      }
    };
    
    if (authorizationToken) fetchProfile();
  }, [authorizationToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      console.log(`Input Change - ${name}: ${value}`, newFormData);
      return newFormData;
    });
  };

  const handleNestedChange = (e, field, subField) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: { ...prev[field], [subField]: value },
      };
      console.log(`Nested Change - ${field}.${subField}: ${value}`, newFormData);
      return newFormData;
    });
  };

  const handleCheckboxChange = (e, field, subField) => {
    const { checked } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [field]: { ...prev[field], [subField]: checked },
      };
      console.log(`Checkbox Change - ${field}.${subField}: ${checked}`, newFormData);
      return newFormData;
    });
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      console.log(`Array Change - ${field}: ${value}`, newFormData);
      return newFormData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0] || null;
    
    if (file) {
      // Create preview for profile picture
      if (name === "profilePicture") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews((prev) => ({ ...prev, profilePicture: reader.result }));
        };
        reader.readAsDataURL(file);
      }
      
      setFiles((prev) => {
        const newFiles = { ...prev, [name]: file };
        console.log(`File Change - ${name}: ${file ? file.name : "null"}`, newFiles);
        return newFiles;
      });
    }
  };

  const validateStage = () => {
    switch (stage) {
      case 1:
        if (!formData.dob) return "Date of Birth is required";
        if (!formData.address.street) return "Street is required";
        if (!formData.address.city) return "City is required";
        if (!formData.address.state) return "State is required";
        if (!formData.address.postalCode || !/^\d{6}$/.test(formData.address.postalCode))
          return "Postal code must be 6 digits";
        break;
      case 2:
        if (
          !formData.yearsOfExperience ||
          isNaN(Number(formData.yearsOfExperience)) ||
          Number(formData.yearsOfExperience) < 0
        )
          return "Years of experience must be a non-negative number";
        if (
          formData.isLicensed &&
          (!formData.licenseDetails.number || !formData.licenseDetails.issuingAuthority)
        )
          return "License number and issuing authority are required if licensed";
        break;
      case 3:
        if (
          formData.preferredSessionMode.length === 0 ||
          !formData.preferredSessionMode.every((mode) =>
            ["Video Call", "Chat", "Audio Call"].includes(mode)
          )
        )
          return "At least one valid session mode (Video Call, Chat, Audio Call) is required";
        if (!formData.paymentMethod) return "Payment method is required";
        if (formData.bio.length < 10) return "Bio must be at least 10 characters";
        if (formData.languages.length === 0) return "At least one language is required";
        break;
      case 4:
        if (!files.resume || !files.degreeCertificate || !files.governmentId)
          return "Resume, Degree Certificate, and Government ID are required";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStage();
    if (error) {
      toast.error(error);
      return;
    }
    setStage((prev) => prev + 1);
  };

  const handleBack = () => setStage((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("dob", new Date(formData.dob).toISOString());
    data.append("address", JSON.stringify(formData.address));
    data.append("yearsOfExperience", Number(formData.yearsOfExperience));
    data.append("isLicensed", formData.isLicensed.toString());
    if (formData.isLicensed) data.append("licenseDetails", JSON.stringify(formData.licenseDetails));
    data.append("availability", JSON.stringify(formData.availability));
    data.append("preferredSessionMode", JSON.stringify(formData.preferredSessionMode));
    data.append(
      "pricing",
      JSON.stringify({
        perSession: formData.pricing.perSession ? Number(formData.pricing.perSession) : undefined,
        subscription: formData.pricing.subscription ? Number(formData.pricing.subscription) : undefined,
        customPricing: formData.pricing.customPricing || undefined,
      })
    );
    data.append("paymentMethod", formData.paymentMethod);
    data.append("bankDetails", JSON.stringify(formData.bankDetails));
    data.append("bio", formData.bio);
    data.append("languages", JSON.stringify(formData.languages));

    for (const key in files) {
      if (files[key]) data.append(key, files[key]);
    }

    console.log("Submitting Application Data:", {
      formData,
      files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v ? v.name : null])),
    });

    try {
      const response = await fetch(`${backendUrl}/api/counselors/application`, {
        method: "POST",
        headers: { Authorization: authorizationToken },
        body: data,
      });
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(`${responseData.message}: ${responseData.extraDetails || "Unknown error"}`);
        setLoading(false);
        return;
      }

      toast.success("Application submitted successfully!");
      setStatus("Pending");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fieldName) => {
    switch(fieldName) {
      case "resume": return faFileAlt;
      case "degreeCertificate": return faUniversity;
      case "licenseCertification": return faCertificate;
      case "governmentId": return faIdCard;
      case "profilePicture": return faUser;
      default: return faFileAlt;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with progress steps */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Counselor Application</h1>
          <p className="text-indigo-100 mb-6">
            Complete your profile to start helping clients on our platform
          </p>
          
          <div className="flex justify-between relative">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${stage >= step.number ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}
                >
                  {step.number}
                </div>
                <span className={`text-xs mt-2 ${stage >= step.number ? 'font-semibold' : 'text-indigo-200'}`}>
                  {step.title}
                </span>
              </div>
            ))}
            <div className="absolute h-1 bg-indigo-400 top-5 left-10 right-10 -z-0">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${(stage - 1) * 33.33}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {status === "Pending" || status === "Rejected" ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Application {status === "Pending" ? "Submitted" : "Review Needed"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {status === "Pending" 
                  ? "Your application is under review. Our team will verify your details and get back to you within 24-48 hours."
                  : "Your previous application needs review. Please check your email for details or contact support."}
              </p>
              <button
                onClick={() => navigate("/counselor-profile")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                View Application Status
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: stage > 1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: stage > 1 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
              >
                {stage === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <div className="relative">
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                          />
                          <FontAwesomeIcon 
                            icon={faCalendarAlt} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-8">Address Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="street"
                            value={formData.address.street}
                            onChange={(e) => handleNestedChange(e, "address", "street")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                          />
                          <FontAwesomeIcon 
                            icon={faMapMarkerAlt} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="city"
                            value={formData.address.city}
                            onChange={(e) => handleNestedChange(e, "address", "city")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                          />
                          <FontAwesomeIcon 
                            icon={faMapMarkerAlt} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="state"
                            value={formData.address.state}
                            onChange={(e) => handleNestedChange(e, "address", "state")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                          />
                          <FontAwesomeIcon 
                            icon={faMapMarkerAlt} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.address.postalCode}
                            onChange={(e) => handleNestedChange(e, "address", "postalCode")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                            pattern="\d{6}"
                          />
                          <FontAwesomeIcon 
                            icon={faMapMarkerAlt} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            required
                            min="0"
                          />
                          <FontAwesomeIcon 
                            icon={faBriefcase} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="isLicensed"
                        checked={formData.isLicensed}
                        onChange={(e) => setFormData((prev) => {
                          const newFormData = { ...prev, isLicensed: e.target.checked };
                          console.log("Checkbox Change - isLicensed:", e.target.checked, newFormData);
                          return newFormData;
                        })}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isLicensed" className="text-sm font-medium text-gray-700">
                        Are you a licensed professional?
                      </label>
                    </div>
                    
                    {formData.isLicensed && (
                      <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-800">License Details</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">License Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                name="number"
                                value={formData.licenseDetails.number}
                                onChange={(e) => handleNestedChange(e, "licenseDetails", "number")}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                required
                              />
                              <FontAwesomeIcon 
                                icon={faIdCard} 
                                className="absolute right-3 top-3.5 text-gray-400"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Issuing Authority</label>
                            <div className="relative">
                              <input
                                type="text"
                                name="issuingAuthority"
                                value={formData.licenseDetails.issuingAuthority}
                                onChange={(e) => handleNestedChange(e, "licenseDetails", "issuingAuthority")}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                required
                              />
                              <FontAwesomeIcon 
                                icon={faUniversity} 
                                className="absolute right-3 top-3.5 text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {stage === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Availability & Pricing</h2>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800">Availability</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["weekdays", "weekends", "morning", "afternoon", "evening"].map((time) => (
                          <label key={time} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.availability[time]}
                              onChange={(e) => handleCheckboxChange(e, "availability", time)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-700 capitalize">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Preferred Session Mode</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="preferredSessionMode"
                          value={formData.preferredSessionMode.join(", ")}
                          onChange={(e) => handleArrayChange(e, "preferredSessionMode")}
                          placeholder="Video Call, Chat, Audio Call"
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                          required
                        />
                        <FontAwesomeIcon 
                          icon={faCheckSquare} 
                          className="absolute right-3 top-3.5 text-gray-400"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter comma separated values</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Per Session Price (₹)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="perSession"
                            value={formData.pricing.perSession}
                            onChange={(e) => handleNestedChange(e, "pricing", "perSession")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            min="0"
                          />
                          <FontAwesomeIcon 
                            icon={faMoneyBillWave} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Monthly Subscription (₹)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="subscription"
                            value={formData.pricing.subscription}
                            onChange={(e) => handleNestedChange(e, "pricing", "subscription")}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                            min="0"
                          />
                          <FontAwesomeIcon 
                            icon={faMoneyBillWave} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Custom Pricing</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="customPricing"
                            value={formData.pricing.customPricing}
                            onChange={(e) => handleNestedChange(e, "pricing", "customPricing")}
                            placeholder="e.g., Sliding scale"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                          />
                          <FontAwesomeIcon 
                            icon={faMoneyBillWave} 
                            className="absolute right-3 top-3.5 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                        required
                      >
                        <option value="">Select Payment Method</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border h-32"
                        required
                        minLength="10"
                        placeholder="Tell us about your professional background, approach, and specialties..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Languages Spoken</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="languages"
                          value={formData.languages.join(", ")}
                          onChange={(e) => handleArrayChange(e, "languages")}
                          placeholder="English, Hindi, Spanish..."
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                          required
                        />
                        <FontAwesomeIcon 
                          icon={faCheckSquare} 
                          className="absolute right-3 top-3.5 text-gray-400"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Enter comma separated values</p>
                    </div>
                  </div>
                )}

                {stage === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Document Upload</h2>
                    <p className="text-gray-600">
                      Please upload the required documents to verify your professional credentials.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {["resume", "degreeCertificate", "licenseCertification", "governmentId", "profilePicture"].map((field) => (
                        <div key={field} className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {field.replace(/([A-Z])/g, " $1")}
                            {["resume", "degreeCertificate", "governmentId"].includes(field) && " *"}
                          </label>
                          
                          <div className="mt-1">
                            <label
                              htmlFor={field}
                              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer ${files[field] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
                            >
                              {field === "profilePicture" && filePreviews.profilePicture ? (
                                <div className="relative w-full h-40">
                                  <img 
                                    src={filePreviews.profilePicture} 
                                    alt="Profile preview" 
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium">Change Photo</span>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <FontAwesomeIcon 
                                    icon={getFileIcon(field)} 
                                    className={`w-10 h-10 mb-3 ${files[field] ? 'text-indigo-600' : 'text-gray-400'}`}
                                  />
                                  <div className="flex flex-col items-center text-sm text-center">
                                    <p className={`mb-1 ${files[field] ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                                      {files[field] 
                                        ? files[field].name 
                                        : `Click to upload ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {field === "profilePicture" 
                                        ? "PNG, JPG, JPEG (Max 5MB)" 
                                        : "PDF, DOC, DOCX (Max 10MB)"}
                                    </p>
                                  </div>
                                </>
                              )}
                            </label>
                            <input
                              id={field}
                              name={field}
                              type="file"
                              onChange={handleFileChange}
                              accept={field === "profilePicture" ? "image/*" : ".pdf,.doc,.docx"}
                              className="hidden"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Document Requirements</h3>
                      <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>Resume should include your full work history and education</li>
                        <li>Degree certificate must be clearly visible</li>
                        <li>Government ID should match your application details</li>
                        <li>License certification (if applicable)</li>
                        <li>Profile picture should be professional</li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {!status && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {stage > 1 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                  Back
                </motion.button>
              )}
              
              {stage < 4 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`ml-auto inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="0.75" width="20" visible={true} className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <FontAwesomeIcon icon={faCloudUploadAlt} className="ml-2" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Application;