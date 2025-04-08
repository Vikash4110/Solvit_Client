import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const FindCounselors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ specialization: "", language: "", sessionMode: "" });
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authorizationToken, role, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/client-login");
    }
  }, [authLoading, role, navigate]);

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        specialization: filters.specialization,
        language: filters.language,
        sessionMode: filters.sessionMode,
      }).toString();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?${query}`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch counselors");
      const data = await response.json();

      // Fetch profile pictures as blobs
      const counselorsWithImages = await Promise.all(
        data.map(async (counselor) => {
          if (counselor.profilePicture) {
            const imageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselor.profilePicture}`, {
              headers: { Authorization: authorizationToken },
            });
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              counselor.profilePictureUrl = URL.createObjectURL(blob);
            } else {
              counselor.profilePictureUrl = "https://via.placeholder.com/80"; // Fallback
            }
          } else {
            counselor.profilePictureUrl = "https://via.placeholder.com/80"; // Fallback
          }
          return counselor;
        })
      );

      setCounselors(counselorsWithImages);
    } catch (error) {
      console.error("Error fetching counselors:", error);
      toast.error("Failed to load counselors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
  }, [searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Counselors</h1>

        {/* Search Bar and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search counselors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              name="specialization"
              value={filters.specialization}
              onChange={handleFilterChange}
              className="w-full md:w-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Specializations</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Career Counseling">Career Counseling</option>
              <option value="Relationship Counseling">Relationship Counseling</option>
              <option value="Life Coaching">Life Coaching</option>
            </select>
            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              className="w-full md:w-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="sessionMode"
              value={filters.sessionMode}
              onChange={handleFilterChange}
              className="w-full md:w-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Session Modes</option>
              <option value="Video Call">Video Call</option>
              <option value="Chat">Chat</option>
              <option value="Audio Call">Audio Call</option>
            </select>
          </div>
        </div>

        {/* Counselor Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <motion.div
                key={counselor._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={counselor.profilePictureUrl}
                    alt={counselor.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-teal-500"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{counselor.fullName}</h3>
                    <p className="text-gray-600">{counselor.specialization.join(", ")}</p>
                    <p className="text-sm text-gray-500">Languages: {counselor.languages.join(", ")}</p>
                    <p className="text-sm text-gray-500">Session Mode: {counselor.preferredSessionMode.join(", ")}</p>
                    <p className="text-sm text-gray-500">Experience: {counselor.yearsOfExperience} years</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/counselor-profile/${counselor._id}`)}
                  className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FindCounselors;