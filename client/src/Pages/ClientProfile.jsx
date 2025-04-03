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
  faCalendarAlt,
  faMapMarkerAlt,
  faLanguage,
  faCheckSquare,
  faSignOutAlt,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClientProfile = () => {
  const { user, logoutUser, isLoading, authorizationToken } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.profilePicture) {
        try {
          const response = await fetch(`${backendUrl}/api/clients/file/${user.profilePicture}`, {
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

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex items-center justify-center px-4 lg:px-10 py-10"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.div className="w-full max-w-5xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-100" variants={cardVariants} initial="hidden" animate="visible">
        <motion.h1
          className="text-4xl font-extrabold text-[#0f6f5c] mb-8 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <FontAwesomeIcon icon={faUser} /> Client Profile
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Profile Picture and Key Info */}
          <motion.div
            className="lg:w-1/3 flex flex-col items-center lg:items-start gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover border-4 border-[#0f6f5c] shadow-md"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="w-48 h-48 text-gray-300" />
            )}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-gray-600 mt-1 flex items-center justify-center lg:justify-start gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#0f6f5c]" /> {user.email || "N/A"}
              </p>
              <p className="text-gray-600 flex items-center justify-center lg:justify-start gap-2">
                <FontAwesomeIcon icon={faPhone} className="text-[#0f6f5c]" /> {user.contactNumber || "N/A"}
              </p>
            </div>
            <motion.button
              onClick={logoutUser}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </motion.button>
          </motion.div>

          {/* Right Column: Detailed Info */}
          <motion.div
            className="lg:w-2/3 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#0f6f5c] mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 bg-teal-50 p-4 rounded-xl shadow-sm">
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faVenusMars} className="text-[#0f6f5c]" />
                  <span className="font-semibold">Gender:</span> {user.gender || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-[#0f6f5c]" />
                  <span className="font-semibold">DOB:</span> {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </p>
                <p className="md:col-span-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#0f6f5c]" />
                  <span className="font-semibold">Address:</span>{" "}
                  {user.address
                    ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}`
                    : "Not provided"}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-[#0f6f5c]" />
                  <span className="font-semibold">Username:</span> {user.username || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLanguage} className="text-[#0f6f5c]" />
                  <span className="font-semibold">Preferred Language:</span> {user.preferredLanguage || "N/A"}
                </p>
                {user.preferredLanguage === "Other" && (
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLanguage} className="text-[#0f6f5c]" />
                    <span className="font-semibold">Other Language:</span> {user.otherLanguage || "N/A"}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-[#0f6f5c]" />
                  <span className="font-semibold">How Heard About Us:</span> {user.howHeardAboutUs || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckSquare} className="text-[#0f6f5c]" />
                  <span className="font-semibold">Terms Accepted:</span> {user.termsAccepted ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientProfile;