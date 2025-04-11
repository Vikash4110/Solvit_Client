import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaUserTie,
  FaComments,
  FaUserFriends,
  FaBell,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import logo from '../assets/Red Simple.jpeg';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logoutUser, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Navigation links
  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome className="text-lg" /> },
    { to: "/about", text: "About", icon: <FaInfoCircle className="text-lg" /> },
    { to: "/counselors", text: "Counselors", icon: <FaUserFriends className="text-lg" /> },
    { to: "/contact", text: "Contact", icon: <FaComments className="text-lg" /> },
  ];

  // Dashboard and profile links based on role
  const dashboardLink = role === "counselor" ? "/counselor-dashboard" : "/client-dashboard";
  const profileLink = role === "counselor" ? "/counselor-profile" : "/client-profile";

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-2" : "bg-white/90 backdrop-blur-sm py-3"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-1">  
                {/* <FaComments className="h-6 w-6 text-white" /> */}
                <img src={logo} className="h-16 w-16 text-white" alt="" />     
              <motion.span className="text-2xl font-bold text-gray-800">
                <span className="text-teal-600">Solvit</span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.to} className="relative group">
                <Link
                  to={link.to}
                  className={`px-4 py-2.5 rounded-md font-medium flex items-center transition-all ${
                    location.pathname === link.to
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            {/* <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors relative"
              aria-label="Search"
            >
              <FaSearch className="w-5 h-5" />
            </button> */}

            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                {/* <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors relative">
                  <FaBell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button> */}

                {/* User Dropdown */}
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-gray-700">
                      {user?.fullName || "User"}
                    </span>
                    {isDropdownOpen ? (
                      <FaChevronUp className="text-gray-500 text-xs" />
                    ) : (
                      <FaChevronDown className="text-gray-500 text-xs" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-700">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to={profileLink}
                          className="px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center"
                        >
                          <FaUser className="mr-3 text-gray-500" /> Profile
                        </Link>
                        <Link
                          to={dashboardLink}
                          className="px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center"
                        >
                          <FaHome className="mr-3 text-gray-500" /> Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center border-t border-gray-100"
                        >
                          <FaSignOutAlt className="mr-3 text-gray-500" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/counselor-login"
                  className="hidden lg:flex items-center px-4 py-2 rounded-md font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <FaUserTie className="mr-2" /> Counselor Login
                </Link>
                <Link
                  to="/client-login"
                  className="hidden lg:flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-md font-medium hover:from-teal-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  <FaUser className="mr-2" /> Client Login
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-teal-600 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search counselors, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white"
                  autoFocus
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 font-medium"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 pr-4 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <React.Fragment key={link.to}>
                    <Link
                      to={link.to}
                      className={`px-4 py-3 rounded-md font-medium flex items-center ${
                        location.pathname === link.to
                          ? "bg-teal-50 text-teal-600"
                          : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </Link>
                  </React.Fragment>
                ))}

                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to={profileLink}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="mr-3 text-gray-500" /> Profile
                    </Link>
                    <Link
                      to={dashboardLink}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaHome className="mr-3 text-gray-500" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-md font-medium flex items-center text-gray-700 hover:bg-red-50 hover:text-red-600 text-left"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-500" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      to="/counselor-login"
                      className="px-4 py-3 rounded-md font-medium flex items-center justify-center bg-teal-50 text-teal-600 hover:bg-teal-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserTie className="mr-2" /> Counselor Login
                    </Link>
                    <Link
                      to="/client-login"
                      className="px-4 py-3 rounded-md font-medium flex items-center justify-center bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="mr-2" /> Client Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;