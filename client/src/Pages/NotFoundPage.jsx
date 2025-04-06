import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-gray-100 px-4 py-12"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        variants={containerVariants}
      >
        {/* Icon */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-teal-500 text-6xl"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl font-extrabold text-gray-800 mb-4"
          variants={textVariants}
        >
          404
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          className="text-2xl font-semibold text-teal-600 mb-4"
          variants={textVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-600 mb-8 leading-relaxed"
          variants={textVariants}
        >
          Oops! It seems like you’ve wandered off the path. The page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Back to Home Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-600 transition-all duration-300 shadow-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;