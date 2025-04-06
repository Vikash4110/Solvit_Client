import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faCalendarAlt,
  faMapMarkerAlt,
  faLanguage,
  faCheckSquare,
  faSignOutAlt,
  faQuestionCircle,
  faEdit,
  faGlobe,
  faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { motion } from "framer-motion";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ClientProfile = () => {
  const { user, logoutUser, isLoading, authorizationToken } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.profilePicture) {
        try {
          const response = await fetch(`${backendUrl}/api/clients/file/${user.profilePicture}`, {
            method: "GET",
            headers: { Authorization: authorizationToken },
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setProfilePictureUrl(url);
            return () => window.URL.revokeObjectURL(url);
          } else {
            console.error("Failed to fetch profile picture");
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };
    fetchProfilePicture();
  }, [user, authorizationToken]);

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RotatingLines strokeColor="#0f6f5c" strokeWidth="5" animationDuration="0.75" width="48" visible={true} />
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xl text-gray-600">Please log in to view your profile.</div>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">Welcome back, {user.fullName || 'Client'}!</p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:flex">
            {/* Left Sidebar */}
            <motion.div 
              className="md:w-1/3 bg-gradient-to-b from-teal-600 to-teal-700 p-8 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-teal-500 flex items-center justify-center border-4 border-white shadow-lg">
                      <FontAwesomeIcon icon={faUser} className="text-white text-6xl" />
                    </div>
                  )}
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-white text-teal-700 rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon={faEdit} size="sm" />
                  </motion.button>
                </div>

                <h2 className="text-2xl font-bold mb-1 text-center">{user.fullName}</h2>
                <p className="text-teal-100 mb-6 text-center">{user.username || 'N/A'}</p>

                <div className="w-full space-y-4 mb-8">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 w-5" />
                    <span className="truncate">{user.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-3 w-5" />
                    <span>{user.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faGlobe} className="mr-3 w-5" />
                    <span>{user.preferredLanguage || "N/A"}</span>
                  </div>
                </div>

                <motion.button
                  onClick={logoutUser}
                  className="w-full flex items-center justify-center gap-2 bg-white text-teal-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Sign Out
                </motion.button>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              className="md:w-2/3 p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                <button
                  className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'personal' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Personal Info
                </button>
                {/* <button
                  className={`py-2 px-4 font-medium text-sm flex items-center gap-2 ${activeTab === 'account' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('account')}
                >
                  <FontAwesomeIcon icon={faFileSignature} />
                  Account Settings
                </button> */}
              </div>

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-teal-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</p>
                          <p className="font-medium">{user.fullName || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</p>
                          <p className="font-medium">{user.gender || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</p>
                          <p className="font-medium">{formatDate(user.dob)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-teal-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                          <p className="font-medium">{user.email || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                          <p className="font-medium">{user.contactNumber || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                          <p className="font-medium">
                            {user.address 
                              ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FontAwesomeIcon icon={faQuestionCircle} className="text-teal-600" />
                        Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-gray-700">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Language</p>
                            <p className="font-medium">
                              {user.preferredLanguage === "Other" 
                                ? user.otherLanguage || "Other" 
                                : user.preferredLanguage || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">How you found us</p>
                            <p className="font-medium">{user.howHeardAboutUs || "N/A"}</p>
                          </div>
                        </div>
                        <div className="space-y-3 text-gray-700">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</p>
                            <p className="font-medium text-teal-600">Active</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Terms Accepted</p>
                            <p className="font-medium">{user.termsAccepted ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Account Settings Tab */}
              {activeTab === 'account' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Change Password</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="border-b border-gray-200 pb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Profile Picture</h4>
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0">
                            {profilePictureUrl ? (
                              <img
                                src={profilePictureUrl}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input 
                              type="file" 
                              id="profile-picture"
                              className="hidden"
                              accept="image/*"
                            />
                            <label 
                              htmlFor="profile-picture"
                              className="inline-block bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              Change Photo
                            </label>
                            <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size of 2MB</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-4">Danger Zone</h4>
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-red-800">Delete Account</h5>
                              <p className="text-sm text-red-600">Once you delete your account, there is no going back.</p>
                            </div>
                            <button className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors">
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClientProfile;