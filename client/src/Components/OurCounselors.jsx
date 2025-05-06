import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaStar, FaRegClock, FaGlobe } from "react-icons/fa";
import { FiAward, FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const OurCounselors = () => {
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch verified counselors
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/verified-counselors`);
        if (!response.ok) throw new Error("Failed to fetch counselors");
        const data = await response.json();
        setCounselors(data);
      } catch (err) {
        setError("Unable to load counselors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCounselors();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2,
        when: "beforeChildren"
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.6, -0.05, 0.01, 0.99] 
      } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      } 
    },
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
      transition: { 
        duration: 0.3 
      } 
    },
    tap: { 
      scale: 0.98 
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <PulseLoader color="#0d9488" size={20} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="text-teal-600 font-medium"
          >
            Loading professional counselors...
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 flex items-center justify-center px-4">
        <motion.div 
          className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHeart className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.section
      className="py-20 bg-gradient-to-b from-gray-50 to-teal-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">Expert Counselors</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Carefully selected professionals dedicated to your mental wellness journey. Each counselor is verified and brings years of experience to support you.
          </motion.p>
        </motion.div>

        {/* Counselors Grid */}
        {counselors.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center relative overflow-hidden"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-200 rounded-full opacity-10 blur-xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-10 blur-xl translate-y-1/2 -translate-x-1/2"></div>
            </div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-teal-500 text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Counselors Available</h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
                We're currently onboarding more expert counselors to serve you better. Please check back soon!
              </p>
              <motion.a
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-medium py-3 px-8 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Return to Home
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {counselors.map((counselor) => (
              <motion.div
                key={counselor._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden group"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-teal-100 rounded-full opacity-10 blur-xl -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-100 rounded-full opacity-10 blur-xl translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  {/* Counselor Image */}
                  <div className="relative mb-4">
                    <img
                      src={counselor.profilePictureUrl}
                      alt={counselor.fullName}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 right-2 bg-teal-500 text-white rounded-full p-1 shadow-md">
                      <FiAward className="text-sm" />
                    </div>
                  </div>
                  
                  {/* Counselor Info */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {counselor.fullName}
                  </h3>
                  <p className="text-sm text-teal-600 font-medium text-center mb-3">
                    {counselor.specialization.join(", ")}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < 4.5 ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">4.5</span>
                  </div>
                  
                  {/* Details */}
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaRegClock className="text-teal-500 mr-2" />
                      <span><span className="font-medium">Experience:</span> {counselor.yearsOfExperience} years</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <FaGlobe className="text-teal-500 mr-2 mt-0.5" />
                      <span><span className="font-medium">Languages:</span> {counselor.languages.join(", ")}</span>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <p className="text-sm text-gray-600 text-center mb-6 line-clamp-3">
                    {counselor.bio || "Experienced counselor dedicated to helping you achieve your personal and professional goals."}
                  </p>
                  
                  {/* Action Button */}
                  <motion.button
                    onClick={() => navigate("/client-register")}
                    className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg hover:from-teal-600 hover:to-indigo-700 transition-all shadow-sm"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Book Session
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* CTA Section */}
        {counselors.length > 0 && (
          <motion.div 
            className="mt-16 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-xl shadow-xl p-8 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h3>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Our counselors are here to help you navigate life's challenges with professional guidance and support.
            </p>
            <motion.button
              onClick={() => navigate("/client-register")}
              className="bg-white text-teal-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default OurCounselors;