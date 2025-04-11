import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authorizationToken, role, isLoading: authLoading } = useAuth();

  // Redirect non-clients
  useEffect(() => {
    if (!authLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/client-login");
    }
  }, [authLoading, role, navigate]);

  // Fetch sent requests
  const fetchSentRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/sent-requests`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch sent requests");
      const data = await response.json();

      // Fetch profile pictures for counselors
      const requestsWithImages = await Promise.all(
        data.map(async (req) => {
          if (req.counselorId.profilePicture) {
            try {
              const imageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${req.counselorId.profilePicture}`, {
                headers: { Authorization: authorizationToken },
              });
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                req.counselorId.profilePictureUrl = URL.createObjectURL(blob);
              } else {
                req.counselorId.profilePictureUrl = "/default-profile.png";
              }
            } catch (error) {
              req.counselorId.profilePictureUrl = "/default-profile.png";
            }
          } else {
            req.counselorId.profilePictureUrl = "/default-profile.png";
          }
          return req;
        })
      );

      setRequests(requestsWithImages.filter((req) => req.status === "Pending"));
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      toast.error("Failed to load sent requests.");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw request
  const handleWithdraw = async (requestId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/withdraw-request/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Request withdrawn successfully!");
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error(error.message || "Failed to withdraw request");
    }
  };

  useEffect(() => {
    if (!authLoading) fetchSentRequests();
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Withdraw Sent Requests</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your pending requests to counselors below.
          </p>
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={req.counselorId.profilePictureUrl}
                        alt={req.counselorId.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{req.counselorId.fullName}</h3>
                        <p className="text-gray-600 text-sm">{req.counselorId.specialization.join(", ")}</p>
                        <p className="text-gray-500 text-sm">Status: {req.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleWithdraw(req._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <img src="/no-results.svg" alt="No requests" className="w-48 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Requests</h3>
              <p className="text-gray-600 mb-6">
                You haven’t sent any pending requests yet. Explore counselors to connect!
              </p>
              <button
                onClick={() => navigate("/find-counselors")}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                Find Counselors
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WithdrawRequests;