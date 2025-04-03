// src/Pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminPanel = () => {
  const { authorizationToken, role } = useAuth();
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/pending-applications`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        if (!response.ok) throw new Error("Failed to fetch applications");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        toast.error("Error fetching applications");
        console.error(error);
      }
    };

    fetchApplications();
  }, [authorizationToken, role, navigate]);

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
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
          Admin Dashboard - Pending Counselor Applications
        </h1>
        {applications.length === 0 ? (
          <p className="text-center text-gray-600">No pending applications.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <motion.div
                key={app._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-xl font-semibold text-teal-600 mb-4">{app.fullName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <p><strong>Email:</strong> {app.email}</p>
                  <p><strong>Phone:</strong> {app.phoneNumber}</p>
                  <p><strong>Gender:</strong> {app.gender}</p>
                  <p><strong>Highest Qualification:</strong> {app.highestQualification}</p>
                  <p><strong>Specialization:</strong> {app.specialization.join(", ")}</p>
                  <p><strong>Date of Birth:</strong> {new Date(app.dob).toLocaleDateString()}</p>
                  <p><strong>Address:</strong> {`${app.address.street}, ${app.address.city}, ${app.address.state}, ${app.address.postalCode}`}</p>
                  <p><strong>Years of Experience:</strong> {app.yearsOfExperience}</p>
                  <p><strong>Licensed:</strong> {app.isLicensed ? "Yes" : "No"}</p>
                  {app.isLicensed && (
                    <p><strong>License Details:</strong> {app.licenseDetails.number} - {app.licenseDetails.issuingAuthority}</p>
                  )}
                  <p><strong>Availability:</strong> {Object.entries(app.availability)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(", ")}</p>
                  <p><strong>Session Modes:</strong> {app.preferredSessionMode.join(", ")}</p>
                  <p><strong>Pricing:</strong> 
                    {app.pricing.perSession ? `Per Session: $${app.pricing.perSession}` : ""} 
                    {app.pricing.subscription ? `, Subscription: $${app.pricing.subscription}` : ""} 
                    {app.pricing.customPricing ? `, Custom: ${app.pricing.customPricing}` : ""}
                  </p>
                  <p><strong>Payment Method:</strong> {app.paymentMethod}</p>
                  <p><strong>Bank Details:</strong> {`${app.bankDetails.accountHolderName}, ${app.bankDetails.bankName}, ${app.bankDetails.accountNumber}, IFSC: ${app.bankDetails.ifscCode}`}</p>
                  <p><strong>Bio:</strong> {app.bio}</p>
                  <p><strong>Languages:</strong> {app.languages.join(", ")}</p>
                  <p><strong>Documents:</strong> 
                    {app.documents.resume && <a href={`${backendUrl}/api/counselors/file/${app.documents.resume}`} target="_blank" className="text-teal-600 hover:underline">Resume</a>}
                    {app.documents.degreeCertificate && <span>, </span>}
                    {app.documents.degreeCertificate && <a href={`${backendUrl}/api/counselors/file/${app.documents.degreeCertificate}`} target="_blank" className="text-teal-600 hover:underline">Degree</a>}
                    {app.documents.licenseCertification && <span>, </span>}
                    {app.documents.licenseCertification && <a href={`${backendUrl}/api/counselors/file/${app.documents.licenseCertification}`} target="_blank" className="text-teal-600 hover:underline">License</a>}
                    {app.documents.governmentId && <span>, </span>}
                    {app.documents.governmentId && <a href={`${backendUrl}/api/counselors/file/${app.documents.governmentId}`} target="_blank" className="text-teal-600 hover:underline">Gov ID</a>}
                  </p>
                  <p><strong>Profile Picture:</strong> {app.profilePicture ? <a href={`${backendUrl}/api/counselors/file/${app.profilePicture}`} target="_blank" className="text-teal-600 hover:underline">View</a> : "None"}</p>
                </div>
                <div className="flex space-x-4 mt-4">
                  <motion.button
                    onClick={() => handleStatusUpdate(app._id, "Approved")}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Accept</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleStatusUpdate(app._id, "Rejected")}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Reject</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;