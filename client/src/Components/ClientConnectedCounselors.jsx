import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";

const ClientConnectedCounselors = () => {
  const { authorizationToken } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnectedCounselors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/connected-counselors`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      setCounselors(data);
    } catch (error) {
      toast.error("Failed to load connected counselors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedCounselors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Counselors</h1>
      {loading ? (
        <div>Loading...</div>
      ) : counselors.length === 0 ? (
        <p>No connected counselors found.</p>
      ) : (
        <div className="grid gap-6">
          {counselors.map((counselor) => (
            <motion.div
              key={counselor._id}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={counselor.profilePictureUrl || "/default-profile.png"}
                  alt={counselor.fullName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{counselor.fullName}</h3>
                  <p className="text-gray-600">{counselor.specialization.join(", ")}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientConnectedCounselors;