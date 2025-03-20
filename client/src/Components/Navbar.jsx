import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignInAlt } from 'react-icons/fa'; // Import React Icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-600 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold text-white font-poppins tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Solvit
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-12 flex items-baseline space-x-10">
              <Link
                to="/"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg text-base font-semibold font-poppins transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg text-base font-semibold font-poppins transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                About
              </Link>
              <Link
                to="/counsellors"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg text-base font-semibold font-poppins transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Counsellors
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-blue-200 px-4 py-2 rounded-lg text-base font-semibold font-poppins transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-200 px-5 py-2.5 rounded-full text-base font-semibold font-poppins border-2 border-white hover:border-blue-200 transition duration-300 ease-in-out flex items-center space-x-2 bg-opacity-20 bg-white backdrop-blur-sm"
            >
              <FaUser className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-full text-base font-semibold font-poppins hover:from-blue-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <FaSignInAlt className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-blue-200 hover:bg-indigo-800 focus:outline-none transition duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <FaBars className="h-7 w-7" />
              ) : (
                <FaTimes className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700/95 backdrop-blur-md">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link
              to="/"
              className="text-white hover:text-blue-200 block px-4 py-3 rounded-lg text-lg font-medium font-poppins transition duration-300 bg-indigo-800/50 hover:bg-indigo-800"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-blue-200 block px-4 py-3 rounded-lg text-lg font-medium font-poppins transition duration-300 bg-indigo-800/50 hover:bg-indigo-800"
            >
              About
            </Link>
            <Link
              to="/counsellors"
              className="text-white hover:text-blue-200 block px-4 py-3 rounded-lg text-lg font-medium font-poppins transition duration-300 bg-indigo-800/50 hover:bg-indigo-800"
            >
              Counsellors
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-blue-200 block px-4 py-3 rounded-lg text-lg font-medium font-poppins transition duration-300 bg-indigo-800/50 hover:bg-indigo-800"
            >
              Contact
            </Link>
            <div className="pt-4 space-y-3">
              <Link
                to="/login"
                className="text-blue-200 hover:text-blue-200 block px-4 py-3 rounded-lg text-lg font-medium font-poppins border-2 border-white hover:border-blue-200 transition duration-300 flex items-center space-x-2 bg-opacity-20 bg-white"
              >
                <FaUser className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white block px-4 py-3 rounded-lg text-lg font-medium font-poppins hover:from-blue-600 hover:to-indigo-600 transition duration-300 flex items-center space-x-2 shadow-lg"
              >
                <FaSignInAlt className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;