// src/Pages/CounselorDashboard.jsx
import React, { useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CounselorDashboard = () => {
  const { authorizationToken, user } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!authorizationToken || !user) {
      navigate("/counselor-login");
      return;
    }

    // Check application status
    const checkStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/counselors/profile`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        
        if (!response.ok) throw new Error("Failed to fetch profile");
        
        const data = await response.json();
        
        if (data.status !== "Approved") {
          navigate("/counselor-application");
        }
      } catch (error) {
        console.error("Error checking status:", error);
        toast.error("Error checking application status");
        navigate("/counselor-application");
      }
    };

    checkStatus();
  }, [authorizationToken, navigate, user]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex items-center justify-center px-4 lg:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center">
        <motion.h1
          className="text-4xl font-extrabold text-[#0f6f5c] mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to Your Dashboard
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your application has been approved. You can now start offering counseling services.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CounselorDashboard;