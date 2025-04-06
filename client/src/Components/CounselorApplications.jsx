import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faChevronDown, faChevronUp, faEye } from "@fortawesome/free-solid-svg-icons";
import { FaFileAlt, FaUserTie, FaEnvelope, FaPhone, FaGraduationCap, FaCertificate, FaCalendarAlt, FaMoneyBillWave, FaIdCard } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CounselorApplications = ({ authorizationToken }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [expandedApp, setExpandedApp] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/pending-applications`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data = await response.json();
        setApplications(data);

        // Fetch profile pictures
        const pictures = {};
        for (const app of data) {
          const profilePicId = app.profilePicture || app.documents?.profilePicture; // Check both locations
          if (profilePicId) {
            try {
              const picResponse = await fetch(`${backendUrl}/api/admin/file/${profilePicId}`, {
                headers: { Authorization: authorizationToken },
              });
              if (picResponse.ok) {
                const blob = await picResponse.blob();
                pictures[app._id] = URL.createObjectURL(blob);
              }
            } catch (error) {
              console.error(`Error fetching profile picture for ${app._id}:`, error);
            }
          }
        }
        setProfilePictures(pictures);
      } catch (error) {
        toast.error("Error fetching applications");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();

    return () => {
      Object.values(profilePictures).forEach(url => URL.revokeObjectURL(url));
    };
  }, [authorizationToken]);

  const handleStatusUpdate = async (counselorId, status) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/update-application-status`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ counselorId, status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      const data = await response.json();
      toast.success(data.message);
      setApplications((prev) => prev.filter((app) => app._id !== counselorId));
      setSelectedApp(null);
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/file/${fileId}`, {
        headers: { Authorization: authorizationToken },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || fileId; // Use a meaningful filename if provided
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName || "file"}`);
    } catch (error) {
      toast.error("Error downloading file: " + error.message);
      console.error(error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const viewDetails = (application) => {
    setSelectedApp(application);
  };

  const closeDetails = () => {
    setSelectedApp(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Counselor Applications</h2>
        <div className="text-sm text-gray-500">
          {applications.length} pending application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No pending applications</h3>
          <p className="text-gray-500">All counselor applications have been reviewed.</p>
        </div>
      ) : (
        <>
          {/* List View */}
          <div className="space-y-4">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {profilePictures[app._id] ? (
                      <img 
                        src={profilePictures[app._id]} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <FaUserTie className="text-teal-600 text-xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{app.fullName}</h3>
                      <p className="text-sm text-gray-500">{app.specialization.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => viewDetails(app)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FontAwesomeIcon icon={faEye} size="sm" />
                      <span>View</span>
                    </motion.button>
                    <motion.button
                      onClick={() => toggleExpand(app._id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FontAwesomeIcon icon={expandedApp === app._id ? faChevronUp : faChevronDown} />
                    </motion.button>
                  </div>
                </div>

                {/* Expanded View */}
                <AnimatePresence>
                  {expandedApp === app._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FaEnvelope className="text-gray-400" />
                          <span>{app.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-gray-400" />
                          <span>{app.phoneNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaGraduationCap className="text-gray-400" />
                          <span>{app.highestQualification}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCertificate className="text-gray-400" />
                          <span>{app.isLicensed ? 'Licensed' : 'Not Licensed'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{Object.entries(app.availability)
                            .filter(([_, value]) => value)
                            .map(([key]) => key)
                            .join(", ")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaMoneyBillWave className="text-gray-400" />
                          <span>${app.pricing.perSession || 'N/A'} per session</span>
                        </div>
                      </div>
                      <div className="px-4 pb-4 flex justify-end space-x-2">
                        <motion.button
                          onClick={() => handleStatusUpdate(app._id, "Approved")}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          onClick={() => handleStatusUpdate(app._id, "Rejected")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Detail View Modal */}
          <AnimatePresence>
            {selectedApp && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDetails}
              >
                <motion.div
                  className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                      {profilePictures[selectedApp._id] ? (
                        <img 
                          src={profilePictures[selectedApp._id]} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-teal-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                          <FaUserTie className="text-teal-600" />
                        </div>
                      )}
                      {selectedApp.fullName}'s Application
                    </h3>
                    <button 
                      onClick={closeDetails}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FaUserTie className="text-teal-600 mr-2" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{selectedApp.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedApp.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedApp.phoneNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="font-medium">{selectedApp.specialization.join(", ")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FaGraduationCap className="text-teal-600 mr-2" />
                        Professional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Highest Qualification</p>
                          <p className="font-medium">{selectedApp.highestQualification}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Years of Experience</p>
                          <p className="font-medium">{selectedApp.yearsOfExperience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Licensed</p>
                          <p className="font-medium">{selectedApp.isLicensed ? 'Yes' : 'No'}</p>
                        </div>
                        {selectedApp.isLicensed && (
                          <div>
                            <p className="text-sm text-gray-500">License Details</p>
                            <p className="font-medium">
                              {selectedApp.licenseDetails.number} ({selectedApp.licenseDetails.issuingAuthority})
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Availability & Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <FaCalendarAlt className="text-teal-600 mr-2" />
                          Availability
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500">Days Available</p>
                          <p className="font-medium">
                            {Object.entries(selectedApp.availability)
                              .filter(([_, value]) => value)
                              .map(([key]) => key)
                              .join(", ") || 'N/A'}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Session Modes</p>
                          <p className="font-medium">{selectedApp.preferredSessionMode || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <FaMoneyBillWave className="text-teal-600 mr-2" />
                          Pricing
                        </h4>
                        <div>
                          <p className="text-sm text-gray-500">Per Session</p>
                          <p className="font-medium">
                            {selectedApp.pricing.perSession ? `$${selectedApp.pricing.perSession}` : 'N/A'}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">Subscription</p>
                          <p className="font-medium">
                            {selectedApp.pricing.subscription ? `$${selectedApp.pricing.subscription}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FaFileAlt className="text-teal-600 mr-2" />
                        Documents
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedApp.documents.resume && (
                          <motion.button
                            onClick={() => handleDownload(selectedApp.documents.resume, "Resume")}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center space-x-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>Resume</span>
                            <FontAwesomeIcon icon={faChevronDown} size="xs" />
                          </motion.button>
                        )}
                        {selectedApp.documents.degreeCertificate && (
                          <motion.button
                            onClick={() => handleDownload(selectedApp.documents.degreeCertificate, "DegreeCertificate")}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center space-x-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>Degree</span>
                            <FontAwesomeIcon icon={faChevronDown} size="xs" />
                          </motion.button>
                        )}
                        {selectedApp.documents.licenseCertification && (
                          <motion.button
                            onClick={() => handleDownload(selectedApp.documents.licenseCertification, "LicenseCertification")}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center space-x-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>License</span>
                            <FontAwesomeIcon icon={faChevronDown} size="xs" />
                          </motion.button>
                        )}
                        {selectedApp.documents.governmentId && (
                          <motion.button
                            onClick={() => handleDownload(selectedApp.documents.governmentId, "GovernmentID")}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center space-x-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span>ID</span>
                            <FontAwesomeIcon icon={faChevronDown} size="xs" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FaIdCard className="text-teal-600 mr-2" />
                        Bio
                      </h4>
                      <p className="text-gray-700">{selectedApp.bio || "No bio provided"}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                      <motion.button
                        onClick={() => handleStatusUpdate(selectedApp._id, "Rejected")}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Reject Application
                      </motion.button>
                      <motion.button
                        onClick={() => handleStatusUpdate(selectedApp._id, "Approved")}
                        className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Approve Application
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default CounselorApplications;