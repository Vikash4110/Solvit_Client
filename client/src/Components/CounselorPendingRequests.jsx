import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CounselorPendingRequests = () => {
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/pending-requests`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch pending requests");
      const data = await response.json();

      // Process clients with profile pictures
      const requestsWithImages = await Promise.all(
        data.map(async (req) => {
          if (req.clientId.profilePicture) {
            try {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/clients/file/${req.clientId.profilePicture}`,
                { headers: { Authorization: authorizationToken } }
              );
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                req.clientId.profilePictureUrl = URL.createObjectURL(blob);
              } else {
                req.clientId.profilePictureUrl = "/default-profile.png";
              }
            } catch (error) {
              req.clientId.profilePictureUrl = "/default-profile.png";
            }
          } else {
            req.clientId.profilePictureUrl = "/default-profile.png";
          }
          return req;
        })
      );

      setRequests(requestsWithImages);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/respond-request`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error(error.message || "Failed to respond to request");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Client Requests</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Requests</h3>
              <p className="text-gray-600 mb-6">
                You don't have any pending client requests at the moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <motion.div
                key={req._id}
                className="bg-white p-6 rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={req.clientId.profilePictureUrl}
                    alt={req.clientId.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{req.clientId.fullName}</h3>
                    <p className="text-gray-600">Email: {req.clientId.email}</p>
                    <p className="text-gray-600">Username: {req.clientId.username}</p>
                    <p className="text-gray-600">Gender: {req.clientId.gender}</p>
                    <p className="text-gray-600">
                      Date of Birth: {new Date(req.clientId.dob).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Contact: {req.clientId.contactNumber}</p>
                    <p className="text-gray-600">
  Address: {req.clientId.address?.street || "N/A"}, {req.clientId.address?.city || "N/A"}, {req.clientId.address?.state || "N/A"}, {req.clientId.address?.postalCode || "N/A"}
</p>
                    <p className="text-gray-600">Preferred Language: {req.clientId.preferredLanguage}</p>
                    {req.clientId.otherLanguage && (
                      <p className="text-gray-600">Other Language: {req.clientId.otherLanguage}</p>
                    )}
                    <p className="text-gray-600">Heard About Us: {req.clientId.howHeardAboutUs}</p>
                    {req.clientId.referralCode && (
                      <p className="text-gray-600">Referral Code: {req.clientId.referralCode}</p>
                    )}
                  </div>
                  <div className="flex gap-4 self-start md:self-center">
                    <button
                      onClick={() => handleRespond(req._id, "Accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req._id, "Rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorPendingRequests;