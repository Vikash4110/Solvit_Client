import React from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";

const OurCounselors = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 flex items-center justify-center py-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
            Our Counselors
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Meet our team of verified counselors and coaches, ready to support you in your journey to personal growth.
          </p>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-200 rounded-full opacity-20 blur-xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-xl translate-y-1/2 -translate-x-1/2"></div>
          <FaUsers className="text-teal-500 text-6xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
            We’re working hard to bring you a curated list of expert counselors and coaches. Stay tuned for updates!
          </p>
          <motion.a
            href="/"
            className="inline-block bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:from-teal-600 hover:to-indigo-700 transition-all shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Return to Home
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurCounselors;