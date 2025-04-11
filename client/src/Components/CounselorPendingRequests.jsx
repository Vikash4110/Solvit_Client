import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";

const CounselorPendingRequests = () => {
  const { authorizationToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/pending-requests`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Requests</h1>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <p>No pending requests found.</p>
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
                  src={req.clientId.profilePictureUrl || "/default-profile.png"}
                  alt={req.clientId.fullName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{req.clientId.fullName}</h3>
                  <p className="text-gray-600">{req.clientId.email}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => handleRespond(req._id, "Accepted")}
                    className="bg-green-600 text-white p-2 rounded-full"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleRespond(req._id, "Rejected")}
                    className="bg-red-600 text-white p-2 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounselorPendingRequests;