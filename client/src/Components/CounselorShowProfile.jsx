import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLanguage,
  FaVideo,
  FaClock,
  FaUserGraduate,
  FaStar,
  FaVenusMars,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const CounselorProfile = () => {
  const { counselorId } = useParams();
  const navigate = useNavigate();
  const { authorizationToken, role, isLoading: authLoading } = useAuth();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/client-login");
    }
  }, [authLoading, role, navigate]);

  const fetchCounselorProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?_id=${counselorId}`,
        { headers: { Authorization: authorizationToken } }
      );
      if (!response.ok) throw new Error("Failed to fetch counselor profile");
      const data = await response.json();

      if (data.length === 0) throw new Error("Counselor not found");

      const counselorData = data[0];

      if (counselorData.profilePicture) {
        const imageResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselorData.profilePicture}`,
          { headers: { Authorization: authorizationToken } }
        );
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          counselorData.profilePictureUrl = URL.createObjectURL(blob);
        } else {
          counselorData.profilePictureUrl = "https://via.placeholder.com/150";
        }
      } else {
        counselorData.profilePictureUrl = "https://via.placeholder.com/150";
      }

      setCounselor(counselorData);
    } catch (error) {
      console.error("Error fetching counselor profile:", error);
      toast.error("Failed to load counselor profile");
      navigate("/find-counselors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCounselorProfile();
  }, [counselorId, authorizationToken, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-teal-200 rounded-full mb-6"></div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-medium">Counselor not found.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-200 rounded-full opacity-10 -translate-x-1/2 translate-y-1/2 blur-xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.img
              src={counselor.profilePictureUrl}
              alt={counselor.fullName}
              className="w-48 h-48 rounded-full object-cover border-4 border-teal-500 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                {counselor.fullName}
              </h1>
              <p className="text-xl text-gray-600 mb-3">{counselor.specialization.join(", ")}</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < 4.8 ? "text-yellow-400" : "text-gray-300"} // Placeholder rating
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">4.8 (120 reviews)</span>
              </div>
            </div>
            <motion.button
              onClick={() => navigate("/client-dashboard")}
              className="bg-gray-700 text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-all shadow-md font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Counselor Details */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-100 p-8"
            variants={cardVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Counselor Details</h2>
            <div className="space-y-6 text-gray-700">
              {[
                { icon: <FaVenusMars />, label: "Gender", value: counselor.gender },
                {
                  icon: <FaBirthdayCake />,
                  label: "Date of Birth",
                  value: counselor.dob ? new Date(counselor.dob).toLocaleDateString() : "Not provided",
                },
                {
                  icon: <FaUserGraduate />,
                  label: "Qualification",
                  value: counselor.highestQualification,
                },
                {
                  icon: <FaUserGraduate />,
                  label: "Experience",
                  value: `${counselor.yearsOfExperience} years`,
                },
                { icon: <FaLanguage />, label: "Languages", value: counselor.languages.join(", ") },
                {
                  icon: <FaVideo />,
                  label: "Session Modes",
                  value: counselor.preferredSessionMode.join(", "),
                },
                { icon: <FaEnvelope />, label: "Email", value: counselor.email },
                {
                  icon: <FaStar />,
                  label: "Licensed",
                  value: counselor.isLicensed ? "Yes" : "No",
                  extra: counselor.isLicensed && counselor.licenseDetails?.number && (
                    <p className="text-sm text-gray-500 mt-1">License: {counselor.licenseDetails.number}</p>
                  ),
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-teal-500 text-xl">{item.icon}</div>
                  <div>
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-gray-600">{item.value}</p>
                    {item.extra}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Bio, Pricing, Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <motion.div
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed">
                {counselor.bio ||
                  `I’m a dedicated counselor with over ${counselor.yearsOfExperience} years of experience in ${counselor.specialization.join(
                    " and "
                  )}. My approach is client-centered, focusing on creating a safe and supportive environment to help you achieve your goals.`}
              </p>
            </motion.div>

            {/* Pricing */}
            <motion.div
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Session Rates & Payment</h2>
              <div className="space-y-6 text-gray-700">
                {[
                  { icon: <FaMoneyBillWave />, label: "Per Session", value: `$${counselor.pricing?.perSession || "N/A"}` },
                  {
                    icon: <FaMoneyBillWave />,
                    label: "Subscription",
                    value: `$${counselor.pricing?.subscription || "N/A"} / month`,
                  },
                  ...(counselor.pricing?.customPricing
                    ? [{ icon: <FaMoneyBillWave />, label: "Custom Pricing", value: counselor.pricing.customPricing }]
                    : []),
                  { icon: <FaCreditCard />, label: "Payment Method", value: counselor.paymentMethod || "Not specified" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="text-teal-500 text-xl">{item.icon}</div>
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => toast.info("Booking functionality coming soon!")}
                  className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-3 px-8 rounded-full hover:from-teal-600 hover:to-indigo-700 transition-all shadow-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a Session
                </motion.button>
                <motion.button
                  onClick={() => toast.info("Messaging functionality coming soon!")}
                  className="bg-gray-100 text-gray-800 py-3 px-8 rounded-full hover:bg-gray-200 transition-all shadow-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Availability Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-8"
          variants={cardVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Availability</h2>
          <div className="flex items-start gap-4 text-gray-700">
            <FaClock className="text-teal-500 text-xl" />
            <p className="text-gray-600 leading-relaxed">
              {counselor.availability
                ? `${counselor.availability.weekdays ? "Weekdays" : ""} ${
                    counselor.availability.weekends ? "Weekends" : ""
                  } - ${counselor.availability.morning ? "Morning" : ""} ${
                    counselor.availability.afternoon ? "Afternoon" : ""
                  } ${counselor.availability.evening ? "Evening" : ""}`
                : "Availability not specified"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CounselorProfile;