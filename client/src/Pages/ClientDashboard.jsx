// src/Pages/CounselorDashboard.jsx
import React from "react";
import { motion } from "framer-motion";

const CounselorDashboard = () => {

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 flex items-center justify-center px-4 lg:px-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center">
        <motion.h1
          className="text-4xl font-extrabold text-[#0f6f5c] mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to Solvit! 
          cLIENT
        </motion.h1>

      </div>
    </motion.div>
  );
};

export default CounselorDashboard;