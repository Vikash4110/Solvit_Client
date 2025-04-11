import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";

const ClientSentRequests = () => {
  const { authorizationToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSentRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/sent-requests`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load sent requests");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (requestId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/withdraw-request/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Request withdrawn successfully");
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      toast.error(error.message || "Failed to withdraw request");
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sent Requests</h1>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <p>No sent requests found.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <motion.div
              key={req._id}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={req.counselorId.profilePictureUrl || "/default-profile.png"}
                  alt={req.counselorId.fullName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{req.counselorId.fullName}</h3>
                  <p className="text-gray-600">{req.counselorId.specialization.join(", ")}</p>
                  <p className="text-sm text-gray-500">Status: {req.status}</p>
                </div>
                {req.status === "Pending" && (
                  <button
                    onClick={() => handleWithdraw(req._id)}
                    className="ml-auto bg-red-600 text-white p-2 rounded-full"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientSentRequests;