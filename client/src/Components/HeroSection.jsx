import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import heroImage from "../assets/vecteezy_wonderful-traditional-group-of-students-studying-together-in_57440118.png"; // Replace with your image path

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <section className="bg-gray-100 py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side - Text and Buttons */}
          <div className="space-y-8" data-aos="fade-up">
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600 bg-clip-text text-transparent leading-tight"
              variants={textVariants}
            >
              Empowering Lives with Expert Guidance
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 max-w-md font-medium leading-relaxed"
              variants={textVariants}
            >
              Solvit connects you with verified counselors and coaches to overcome challenges—affordable, flexible, and stigma-free.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
              variants={textVariants}
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/counselor-register"
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-3 hover:bg-teal-800 transition duration-300 shadow-md"
                >
                  <FaUserPlus className="w-5 h-5" />
                  <span>Become a Counselor</span>
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/client-register"
                  className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-semibold flex items-center space-x-3 hover:bg-teal-50 transition duration-300 shadow-md"
                >
                  <FaComments className="w-5 h-5" />
                  <span>Become a Client</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Image */}
          <div className="relative" data-aos="fade-left">
            <motion.div variants={imageVariants}>
              <img
                src={heroImage}
                alt="Counseling Support"
                className="w-full max-w-md mx-auto rounded-xl object-cover "
              />
            </motion.div>
            {/* Subtle Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-200 rounded-full opacity-20 -z-10"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;