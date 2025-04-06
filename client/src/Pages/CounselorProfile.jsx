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
  faCalendarAlt,
  faMapMarkerAlt,
  faBriefcase,
  faFileAlt,
  faEye,
  faSignOutAlt,
  faFileUpload,
  faMoneyBillWave,
  faLanguage,
  faStar,
  faClock,
  faVideo,
  faUserShield,
  faCertificate
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CounselorProfile = () => {
  const { user, logoutUser, isLoading, authorizationToken } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.profilePicture) {
        try {
          const response = await fetch(`${backendUrl}/api/counselors/file/${user.profilePicture}`, {
            method: "GET",
            headers: { Authorization: authorizationToken },
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setProfilePictureUrl(url);
            return () => window.URL.revokeObjectURL(url);
          } else {
            console.error("Failed to fetch profile picture");
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };
    fetchProfilePicture();
  }, [user, authorizationToken]);

  const handleDocumentClick = async (fileId, fileName) => {
    setDownloading(fileId);
    try {
      const response = await fetch(`${backendUrl}/api/counselors/file/${fileId}`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = "Failed to fetch document";
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.error || errorMessage;
        } catch (e) {
          errorMessage = errorData || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("Content-Type");
      const blob = await response.blob();

      if (contentType.includes("application/json") || blob.size < 1024) {
        const text = await blob.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success(`Opened ${fileName} in a new tab`);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error opening document:", error);
      toast.error("Failed to open document: " + error.message);
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RotatingLines strokeColor="#0f6f5c" strokeWidth="5" animationDuration="0.75" width="48" visible={true} />
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xl text-gray-600">Please log in to view your profile.</div>
      </motion.div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Personal Information */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-teal-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                <p className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faVenusMars} className="text-teal-600 w-5" />
                  <span className="font-medium">Gender:</span> {user.gender || "N/A"}
                </p>
                <p className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-teal-600 w-5" />
                  <span className="font-medium">DOB:</span> {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </p>
                <p className="md:col-span-2 flex items-start gap-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-600 w-5 mt-1" />
                  <span className="font-medium">Address:</span>{" "}
                  {user.address
                    ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}`
                    : "Not provided"}
                </p>
              </div>
            </motion.div>

            {/* Professional Summary */}
            {user.bio && (
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBriefcase} className="text-teal-600" /> Professional Summary
                </h3>
                <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              </motion.div>
            )}

            {/* Expertise */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} className="text-teal-600" /> Expertise
              </h3>
              <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-teal-600" /> Qualifications
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600">•</span>
                        <span>{user.highestQualification || "Not specified"}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckSquare} className="text-teal-600" /> Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.specialization?.length > 0 ? (
                        user.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full"
                          >
                            {spec}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBriefcase} className="text-teal-600" /> Experience
                    </h4>
                    <p className="flex items-center gap-2">
                      <span className="text-teal-600 font-medium">
                        {user.yearsOfExperience ? `${user.yearsOfExperience} years` : "Not specified"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLanguage} className="text-teal-600" /> Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.languages?.length > 0 ? (
                        user.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "professional":
        return (
          <div className="space-y-8">
            {/* License & Certification */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCertificate} className="text-teal-600" /> License & Certification
              </h3>
              <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Licensing Status</h4>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${user.isLicensed ? "bg-teal-500" : "bg-amber-500"}`}
                      ></div>
                      <span>{user.isLicensed ? "Licensed Professional" : "Not Licensed"}</span>
                    </div>
                  </div>
                  {user.isLicensed && user.licenseDetails && (
                    <>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">License Number</h4>
                        <p>{user.licenseDetails.number || "Not provided"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Issuing Authority</h4>
                        <p>{user.licenseDetails.issuingAuthority || "Not provided"}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-teal-600" /> Availability
              </h3>
              <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Working Days</h4>
                    {user.availability ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(user.availability)
                          .filter(([_, v]) => v)
                          .map(([day]) => (
                            <span
                              key={day}
                              className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full"
                            >
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Session Modes</h4>
                    {user.preferredSessionMode?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.preferredSessionMode.map((mode) => (
                          <span
                            key={mode}
                            className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full"
                          >
                            {mode}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-teal-600" /> Pricing & Payment
              </h3>
              <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Session Rates</h4>
                    {user.pricing ? (
                      <div className="space-y-2">
                        {user.pricing.perSession && (
                          <p>Per Session: ₹{user.pricing.perSession}</p>
                        )}
                        {user.pricing.subscription && (
                          <p>Subscription: ₹{user.pricing.subscription}</p>
                        )}
                        {user.pricing.customPricing && (
                          <p>Custom: {user.pricing.customPricing}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Payment Information</h4>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Method:</span> {user.paymentMethod || "Not specified"}
                      </p>
                      {user.bankDetails && (
                        <>
                          <p>
                            <span className="font-medium">Bank:</span> {user.bankDetails.bankName || "Not specified"}
                          </p>
                          <p>
                            <span className="font-medium">Account:</span>{" "}
                            {user.bankDetails.accountHolderName || "Not specified"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "documents":
        return (
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-teal-600" /> Professional Documents
            </h3>
            <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
              {user.documents && Object.keys(user.documents).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { type: "resume", label: "Professional Resume", icon: faUserShield },
                    { type: "degreeCertificate", label: "Degree Certificate", icon: faGraduationCap },
                    { type: "licenseCertification", label: "License Certification", icon: faCertificate },
                    { type: "governmentId", label: "Government ID", icon: faUser }
                  ].map(({ type, label, icon }) => {
                    const fileId = user.documents[type];
                    return fileId ? (
                      <motion.button
                        key={type}
                        onClick={() => handleDocumentClick(fileId, label)}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-teal-200 hover:bg-teal-50 hover:shadow-md transition-all duration-300 text-left w-full"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                          <FontAwesomeIcon icon={icon} className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{label}</h4>
                          <p className="text-sm text-gray-500 mt-1">Click to view</p>
                        </div>
                        {downloading === fileId ? (
                          <RotatingLines strokeColor="#0f6f5c" strokeWidth="5" animationDuration="0.75" width="20" visible={true} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} className="text-teal-600 text-lg" />
                        )}
                      </motion.button>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FontAwesomeIcon icon={faFileUpload} className="text-gray-300 text-4xl mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No documents uploaded</h4>
                  <p className="text-gray-500 max-w-md">
                    Complete your professional profile by uploading your credentials and certifications.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:flex">
            {/* Profile Picture & Basic Info */}
            <div className="md:w-1/3 p-8 bg-gradient-to-br from-teal-600 to-teal-700 text-white flex flex-col items-center">
              <div className="relative mb-6">
                {profilePictureUrl ? (
                  <motion.img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon icon={faUser} className="text-white text-6xl" />
                  </div>
                )}
                {user.isLicensed && (
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-2 shadow-md">
                    <FontAwesomeIcon icon={faCertificate} className="text-sm" />
                  </div>
                )}
              </div>

              <motion.h2
                className="text-2xl font-bold text-center mb-1"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {user.fullName}
              </motion.h2>
              <motion.p
                className="text-teal-100 text-center mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {user.highestQualification || "Professional Counselor"}
              </motion.p>

              <div className="w-full space-y-4">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-teal-200" />
                  <span className="text-teal-50">{user.email || "N/A"}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <FontAwesomeIcon icon={faPhone} className="text-teal-200" />
                  <span className="text-teal-50">{user.phoneNumber || "N/A"}</span>
                </motion.div>
                {user.yearsOfExperience && (
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <FontAwesomeIcon icon={faBriefcase} className="text-teal-200" />
                    <span className="text-teal-50">{user.yearsOfExperience} years experience</span>
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={logoutUser}
                className="mt-8 w-full bg-white text-teal-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 shadow-md font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </motion.button>
            </div>

            {/* Profile Content */}
            <div className="md:w-2/3 p-8">
              {/* Navigation Tabs */}
              <motion.div
                className="flex border-b border-gray-200 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <button
                  className={`px-4 py-2 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === "overview" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-500"}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <FontAwesomeIcon icon={faUser} /> Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === "professional" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-500"}`}
                  onClick={() => setActiveTab("professional")}
                >
                  <FontAwesomeIcon icon={faBriefcase} /> Professional
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm md:text-base flex items-center gap-2 ${activeTab === "documents" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-teal-500"}`}
                  onClick={() => setActiveTab("documents")}
                >
                  <FontAwesomeIcon icon={faFileAlt} /> Documents
                </button>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="min-h-[400px]"
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CounselorProfile;