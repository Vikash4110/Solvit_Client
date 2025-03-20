import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaComments } from 'react-icons/fa'; // React Icons
import { motion } from 'framer-motion'; // Framer Motion
import AOS from 'aos'; // AOS
import 'aos/dist/aos.css'; // AOS CSS
import heroImage from '../assets/vecteezy_wonderful-traditional-group-of-students-studying-together-in_57440118.png'; // Replace with your image path

const HeroSection = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Framer Motion variants for buttons
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Quote and Buttons */}
          <div className="space-y-8" data-aos="fade-right">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <blockquote className="text-3xl md:text-4xl font-bold text-indigo-800 font-poppins leading-tight">
                "Empowering lives through accessible guidance and support."
              </blockquote>
              <p className="mt-4 text-lg text-gray-600 font-poppins">
                - Solvit: Your Partner in Progress
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
  <motion.div variants={buttonVariants}  whileTap="tap">
    <Link
      to="/become-counsellor"
      className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold font-poppins flex items-center space-x-3 transition duration-300"
    >
      <FaUserPlus className="w-6 h-6" />
      <span>Become a Counsellor</span>
    </Link>
  </motion.div>

  <motion.div variants={buttonVariants}  whileTap="tap">
    <Link
      to="/seek-counselling"
      className="text-indigo-700 px-8 py-4 rounded-full text-lg font-semibold font-poppins border-2 border-indigo-600 flex items-center space-x-3 hover:bg-indigo-50  transition duration-300"
    >
      <FaComments className="w-6 h-6" />
      <span>Seek Counselling</span>
    </Link>
  </motion.div>
</div>

          </div>

        {/* Right Side - Image */}
<div className="relative" data-aos="fade-left">
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
    className="relative z-10"
  >
    <img
      src={heroImage} // Replace with your actual image
      alt="Counselling Support"
      className="w-full max-w-lg mx-auto rounded-2xl object-cover transition duration-500"
    />
  </motion.div>
  {/* Decorative Background Circle */}
  <div className="absolute inset-0 -z-10 opacity-20 rounded-full"></div>
</div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;