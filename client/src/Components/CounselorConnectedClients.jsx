import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";

const CounselorConnectedClients = () => {
  const { authorizationToken } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnectedClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/connected-clients`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast.error("Failed to load connected clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedClients();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Clients</h1>
      {loading ? (
        <div>Loading...</div>
      ) : clients.length === 0 ? (
        <p>No connected clients found.</p>
      ) : (
        <div className="grid gap-6">
          {clients.map((client) => (
            <motion.div
              key={client._id}
              className="bg-white p-6 rounded-xl shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={client.profilePictureUrl || "/default-profile.png"}
                  alt={client.fullName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{client.fullName}</h3>
                  <p className="text-gray-600">{client.email}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounselorConnectedClients;