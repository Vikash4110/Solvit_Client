import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLanguage, FaVideo, FaClock, FaUserGraduate, FaStar, FaVenusMars, FaBirthdayCake, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?_id=${counselorId}`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch counselor profile");
      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Counselor not found");
      }

      const counselorData = data[0];

      if (counselorData.profilePicture) {
        const imageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselorData.profilePicture}`, {
          headers: { Authorization: authorizationToken },
        });
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
    if (!authLoading) {
      fetchCounselorProfile();
    }
  }, [counselorId, authorizationToken, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600">Counselor not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={counselor.profilePictureUrl}
              alt={counselor.fullName}
              className="w-40 h-40 rounded-full object-cover border-4 border-teal-500 shadow-md"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{counselor.fullName}</h1>
              <p className="text-xl text-gray-600 mb-2">{counselor.specialization.join(", ")}</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm text-gray-500">4.8 (120 reviews)</span> {/* Placeholder */}
              </div>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => navigate("/client-dashboard")}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal & Professional Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Counselor Details</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FaVenusMars className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Gender</p>
                  <p className="text-gray-600">{counselor.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaBirthdayCake className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Date of Birth</p>
                  <p className="text-gray-600">{counselor.dob ? new Date(counselor.dob).toLocaleDateString() : "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserGraduate className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Highest Qualification</p>
                  <p className="text-gray-600">{counselor.highestQualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserGraduate className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Experience</p>
                  <p className="text-gray-600">{counselor.yearsOfExperience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaLanguage className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Languages</p>
                  <p className="text-gray-600">{counselor.languages.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaVideo className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Session Modes</p>
                  <p className="text-gray-600">{counselor.preferredSessionMode.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Contact</p>
                  <p className="text-gray-600">{counselor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaStar className="text-teal-500" />
                <div>
                  <p className="text-gray-700 font-medium">Licensed</p>
                  <p className="text-gray-600">{counselor.isLicensed ? "Yes" : "No"}</p>
                  {counselor.isLicensed && counselor.licenseDetails?.number && (
                    <p className="text-gray-500 text-sm">License: {counselor.licenseDetails.number}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Pricing, and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
              <p className="text-gray-600">
                {counselor.bio || `I’m a dedicated counselor with over ${counselor.yearsOfExperience} years of experience in ${counselor.specialization.join(" and ")}. My approach is client-centered, focusing on creating a safe and supportive environment to help you achieve your goals.`}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Session Rates & Payment</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-teal-500" />
                  <div>
                    <p className="text-gray-700 font-medium">Per Session</p>
                    <p className="text-gray-600">${counselor.pricing?.perSession || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-teal-500" />
                  <div>
                    <p className="text-gray-700 font-medium">Subscription</p>
                    <p className="text-gray-600">${counselor.pricing?.subscription || "N/A"} / month</p>
                  </div>
                </div>
                {counselor.pricing?.customPricing && (
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-teal-500" />
                    <div>
                      <p className="text-gray-700 font-medium">Custom Pricing</p>
                      <p className="text-gray-600">{counselor.pricing.customPricing}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-teal-500" />
                  <div>
                    <p className="text-gray-700 font-medium">Payment Method</p>
                    <p className="text-gray-600">{counselor.paymentMethod || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => toast.info("Booking functionality coming soon!")}
                  className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Book a Session
                </button>
                <button
                  onClick={() => toast.info("Messaging functionality coming soon!")}
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Availability</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <FaClock className="text-teal-500" />
              <p>
                {counselor.availability
                  ? `${counselor.availability.weekdays ? "Weekdays" : ""} ${counselor.availability.weekends ? "Weekends" : ""} - ${
                      counselor.availability.morning ? "Morning" : ""
                    } ${counselor.availability.afternoon ? "Afternoon" : ""} ${counselor.availability.evening ? "Evening" : ""}`
                  : "Availability not specified"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselorProfile;