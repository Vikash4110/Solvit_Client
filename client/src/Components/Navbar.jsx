import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaUserTie, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Framer Motion Variants
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-teal-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <motion.div
            className="flex-shrink-0"
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                Solvit
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <motion.div
              className="ml-12 flex items-baseline space-x-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {["Home", "About", "Counselors", "Contact"].map((item, index) => (
                <motion.div key={index} variants={navItemVariants}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-white hover:text-teal-200 px-4 py-2 rounded-lg text-base font-semibold transition duration-300 ease-in-out"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link
                to="/counselor-login"
                className="text-teal-600 bg-white px-5 py-2 rounded-lg text-base font-semibold border-2 border-teal-600 hover:bg-teal-50 transition duration-300 flex items-center space-x-2 shadow-md"
              >
                <FaUserTie className="w-4 h-4" />
                <span>Login as Counselor</span>
              </Link>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Link
                to="/client-login"
                className="bg-teal-700 text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-teal-800 transition duration-300 flex items-center space-x-2 shadow-md"
              >
                <FaUser className="w-4 h-4" />
                <span>Login as Client</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-teal-200 hover:bg-teal-700 focus:outline-none transition duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? <FaBars className="h-7 w-7" /> : <FaTimes className="h-7 w-7" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-teal-600 shadow-lg"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileMenuVariants}
        >
          <div className="px-4 pt-4 pb-6 space-y-3">
            {["Home", "About", "Counselors", "Contact"].map((item, index) => (
              <motion.div key={index} variants={navItemVariants}>
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-white hover:text-teal-200 block px-4 py-3 rounded-lg text-lg font-medium transition duration-300 hover:bg-teal-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
            <div className="pt-4 space-y-3">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/counselor-login"
                  className="text-teal-600 bg-white block px-4 py-3 rounded-lg text-lg font-medium border-2 border-teal-600 hover:bg-teal-50 transition duration-300 flex items-center space-x-2 shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserTie className="w-5 h-5" />
                  <span>Login as Counselor</span>
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/client-login"
                  className="bg-teal-700 text-white block px-4 py-3 rounded-lg text-lg font-medium hover:bg-teal-800 transition duration-300 flex items-center space-x-2 shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="w-5 h-5" />
                  <span>Login as Client</span>
                </Link>
              </motion.div>
              
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// Container Variants for Desktop Nav
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default Navbar;