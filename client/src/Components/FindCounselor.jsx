// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   FaSearch, 
//   FaFilter, 
//   FaTimes, 
//   FaUserTie, 
//   FaCalendarAlt, 
//   FaMoneyBillWave,
//   FaVideo,
//   FaComments,
//   FaUserFriends
// } from "react-icons/fa";
// import { IoLanguage } from "react-icons/io5";
// import { MdVerified } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuth } from "../Store/auth";

// const FindCounselors = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     specialization: "",
//     language: "",
//     sessionMode: "",
//     priceRange: "",
//     rating: ""
//   });
//   const [counselors, setCounselors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const navigate = useNavigate();
//   const { authorizationToken, role, isLoading: authLoading } = useAuth();

//   // Filter options
//   const specializations = [
//     "Mental Health",
//     "Anxiety",
//     "Depression",
//     "Stress Management",
//     "Career Counseling",
//     "Relationship Counseling",
//     "Family Therapy",
//     "Life Coaching",
//     "Addiction Recovery",
//     "Trauma Therapy"
//   ];

//   const languages = ["English", "Hindi", "Spanish", "French", "Mandarin", "Other"];
//   const sessionModes = ["Video Call", "Chat", "Audio Call", "In-Person"];
//   const priceRanges = ["$0-50", "$50-100", "$100-150", "$150+"];
//   const ratings = ["4+ Stars", "3+ Stars", "Any Rating"];

//   useEffect(() => {
//     if (!authLoading && role !== "client") {
//       toast.error("Access denied. Clients only.");
//       navigate("/client-login");
//     }
//   }, [authLoading, role, navigate]);

//   const fetchCounselors = async () => {
//     setLoading(true);
//     try {
//       const query = new URLSearchParams({
//         search: searchTerm,
//         ...filters
//       }).toString();

//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?${query}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error("Failed to fetch counselors");
//       const data = await response.json();

//       const counselorsWithImages = await Promise.all(
//         data.map(async (counselor) => {
//           if (counselor.profilePicture) {
//             try {
//               const imageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselor.profilePicture}`, {
//                 headers: { Authorization: authorizationToken },
//               });
//               if (imageResponse.ok) {
//                 const blob = await imageResponse.blob();
//                 counselor.profilePictureUrl = URL.createObjectURL(blob);
//               } else {
//                 counselor.profilePictureUrl = "/default-profile.png";
//               }
//             } catch (error) {
//               counselor.profilePictureUrl = "/default-profile.png";
//             }
//           } else {
//             counselor.profilePictureUrl = "/default-profile.png";
//           }
//           return counselor;
//         })
//       );

//       setCounselors(counselorsWithImages);
//     } catch (error) {
//       console.error("Error fetching counselors:", error);
//       toast.error("Failed to load counselors. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchCounselors();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchTerm, filters]);

//   const handleSendRequest = async (counselorId) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/send-request`, {
//         method: "POST",
//         headers: {
//           Authorization: authorizationToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ counselorId }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message);
//       toast.success("Request sent successfully!");
//       fetchCounselors(); // Refresh list
//     } catch (error) {
//       toast.error(error.message || "Failed to send request");
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       specialization: "",
//       language: "",
//       sessionMode: "",
//       priceRange: "",
//       rating: ""
//     });
//   };

//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-blue-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
//           <div className="h-4 w-32 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4 md:p-8">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto"
//       >
//         {/* Header Section */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Counselor</h1>
//           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//             Connect with licensed professionals who specialize in your specific needs
//           </p>
//         </div>

//         {/* Search and Filter Section */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col gap-6">
//             {/* Search Bar */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name, specialization, or keywords..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
//               />
//               <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
//             </div>

//             {/* Filter Toggle */}
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-semibold text-gray-800">Refine Your Search</h3>
//               <button 
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 <FaFilter className="text-teal-600" />
//                 <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
//               </button>
//             </div>

//             {/* Expanded Filters */}
//             <AnimatePresence>
//               {showFilters && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//                       <select
//                         name="specialization"
//                         value={filters.specialization}
//                         onChange={handleFilterChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       >
//                         <option value="">All Specializations</option>
//                         {specializations.map((spec) => (
//                           <option key={spec} value={spec}>{spec}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
//                       <select
//                         name="language"
//                         value={filters.language}
//                         onChange={handleFilterChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       >
//                         <option value="">All Languages</option>
//                         {languages.map((lang) => (
//                           <option key={lang} value={lang}>{lang}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
//                       <select
//                         name="sessionMode"
//                         value={filters.sessionMode}
//                         onChange={handleFilterChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       >
//                         <option value="">All Session Types</option>
//                         {sessionModes.map((mode) => (
//                           <option key={mode} value={mode}>{mode}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
//                       <select
//                         name="priceRange"
//                         value={filters.priceRange}
//                         onChange={handleFilterChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       >
//                         <option value="">Any Price</option>
//                         {priceRanges.map((range) => (
//                           <option key={range} value={range}>{range}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
//                       <select
//                         name="rating"
//                         value={filters.rating}
//                         onChange={handleFilterChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                       >
//                         <option value="">Any Rating</option>
//                         {ratings.map((rating) => (
//                           <option key={rating} value={rating}>{rating}</option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="flex items-end">
//                       <button
//                         onClick={resetFilters}
//                         className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
//                       >
//                         <FaTimes />
//                         <span>Reset Filters</span>
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Results Section */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {counselors.length} {counselors.length === 1 ? 'Professional Available' : 'Professionals Available'}
//             </h2>
//             <div className="text-gray-600">
//               Showing {counselors.length} results
//             </div>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, index) => (
//                 <div key={index} className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="h-3 bg-gray-200 rounded"></div>
//                     <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//                     <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : counselors.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <AnimatePresence>
//                 {counselors.map((counselor) => (
//                   <motion.div
//                     key={counselor._id}
//                     layout
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
//                   >
//                     <div className="p-6">
//                       {/* Counselor Info with Circular Profile Pic */}
//                       <div className="flex items-center gap-4 mb-4">
//                         <img
//                           src={counselor.profilePictureUrl}
//                           alt={counselor.fullName}
//                           className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
//                         />
//                         <div>
//                           <h3 className="text-xl font-semibold text-gray-800">{counselor.fullName}</h3>
//                           <p className="text-gray-500 flex items-center gap-1">
//                             <FaUserTie className="text-teal-500" />
//                             <span>Licensed Counselor</span>
//                           </p>
//                         </div>
//                       </div>

//                       {/* Specializations */}
//                       <div className="mb-4">
//                         <div className="flex flex-wrap gap-2">
//                           {counselor.specialization.slice(0, 3).map((spec) => (
//                             <span key={spec} className="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
//                               {spec}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Bio */}
//                       <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//                         {counselor.bio || "Licensed professional with extensive experience in counseling and mental health support."}
//                       </p>

//                       {/* Stats */}
//                       <div className="grid grid-cols-2 gap-3 mb-4">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <FaCalendarAlt className="text-teal-500" />
//                           <span>{counselor.yearsOfExperience} years</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <IoLanguage className="text-teal-500" />
//                           <span>{counselor.languages.slice(0, 2).join(", ")}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <FaMoneyBillWave className="text-teal-500" />
//                           <span>${counselor.pricing?.perSession || "N/A"}/session</span>
//                         </div>
//                       </div>

//                       {/* Session Types */}
//                       <div className="mb-4">
//                         <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Session Types</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {counselor.preferredSessionMode.map((mode) => (
//                             <span key={mode} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
//                               {mode === "Video Call" && <FaVideo className="text-teal-500" />}
//                               {mode === "Chat" && <FaComments className="text-teal-500" />}
//                               {mode === "Audio Call" && <FaUserFriends className="text-teal-500" />}
//                               {mode}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       {/* <div className="flex gap-3">
//                         <button
//                           onClick={() => navigate(`/counselor-profile/${counselor._id}`)}
//                           className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
//                         >
//                           View Profile
//                         </button>
//                         <button
//                           onClick={() => navigate(`/book-session/${counselor._id}`)}
//                           className="flex-1 bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
//                         >
//                           Book Now
//                         </button>
//                       </div> */}
//                       <div className="flex gap-3">
//   <button
//     onClick={() => navigate(`/counselor-profile/${counselor._id}`)}
//     className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
//   >
//     View Profile
//   </button>
//   <button
//     onClick={() => handleSendRequest(counselor._id)}
//     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
//   >
//     Send Request
//   </button>
// </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//               <div className="max-w-md mx-auto">
//                 <img src="/no-results.svg" alt="No results" className="w-48 mx-auto mb-6" />
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No professionals found</h3>
//                 <p className="text-gray-600 mb-6">
//                   We couldn't find any counselors matching your criteria. Try adjusting your filters.
//                 </p>
//                 <button
//                   onClick={resetFilters}
//                   className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
//                 >
//                   Reset All Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default FindCounselors;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaVideo,
  FaComments,
  FaUserFriends,
} from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const FindCounselors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialization: "",
    language: "",
    sessionMode: "",
    priceRange: "",
    rating: "",
  });
  const [counselors, setCounselors] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // Track sent requests
  const [connectedCounselors, setConnectedCounselors] = useState([]); // Track connected counselors
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { authorizationToken, role, isLoading: authLoading } = useAuth();

  // Filter options
  const specializations = [
    "Mental Health",
    "Anxiety",
    "Depression",
    "Stress Management",
    "Career Counseling",
    "Relationship Counseling",
    "Family Therapy",
    "Life Coaching",
    "Addiction Recovery",
    "Trauma Therapy",
  ];
  const languages = ["English", "Hindi", "Spanish", "French", "Mandarin", "Other"];
  const sessionModes = ["Video Call", "Chat", "Audio Call", "In-Person"];
  const priceRanges = ["$0-50", "$50-100", "$100-150", "$150+"];
  const ratings = ["4+ Stars", "3+ Stars", "Any Rating"];

  // Redirect non-clients
  useEffect(() => {
    if (!authLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/client-login");
    }
  }, [authLoading, role, navigate]);

  // Fetch counselors
  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        ...filters,
      }).toString();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?${query}`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch counselors");
      const data = await response.json();

      const counselorsWithImages = await Promise.all(
        data.map(async (counselor) => {
          if (counselor.profilePicture) {
            try {
              const imageResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselor.profilePicture}`, {
                headers: { Authorization: authorizationToken },
              });
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                counselor.profilePictureUrl = URL.createObjectURL(blob);
              } else {
                counselor.profilePictureUrl = "/default-profile.png";
              }
            } catch (error) {
              counselor.profilePictureUrl = "/default-profile.png";
            }
          } else {
            counselor.profilePictureUrl = "/default-profile.png";
          }
          return counselor;
        })
      );

      // Filter out connected counselors
      const filteredCounselors = counselorsWithImages.filter(
        (counselor) => !connectedCounselors.some((connected) => connected._id === counselor._id)
      );
      setCounselors(filteredCounselors);
    } catch (error) {
      console.error("Error fetching counselors:", error);
      toast.error("Failed to load counselors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch sent requests
  const fetchSentRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/sent-requests`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch sent requests");
      const data = await response.json();
      setSentRequests(data.filter((req) => req.status === "Pending"));
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      toast.error("Failed to load sent requests.");
    }
  };

  // Fetch connected counselors
  const fetchConnectedCounselors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/connected-counselors`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch connected counselors");
      const data = await response.json();
      setConnectedCounselors(data);
    } catch (error) {
      console.error("Error fetching connected counselors:", error);
      toast.error("Failed to load connected counselors.");
    }
  };

  // Send connection request
  const handleSendRequest = async (counselorId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/send-request`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ counselorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Request sent successfully!");
      fetchSentRequests(); // Refresh sent requests
      fetchCounselors(); // Refresh counselor list
    } catch (error) {
      toast.error(error.message || "Failed to send request");
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      specialization: "",
      language: "",
      sessionMode: "",
      priceRange: "",
      rating: "",
    });
  };

  // Fetch data on search term or filter change
  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        fetchCounselors();
        fetchSentRequests();
        fetchConnectedCounselors();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, filters, authLoading]);

  if (authLoading) {
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
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Counselor</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Connect with licensed professionals tailored to your needs.
            </p>
          </div>
          <button
            onClick={() => navigate("/withdraw-requests")}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors font-medium text-sm"
          >
            Withdraw Requests
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, specialization, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Refine Your Search</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaFilter className="text-teal-600" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <select
                        name="specialization"
                        value={filters.specialization}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        name="language"
                        value={filters.language}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Languages</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                      <select
                        name="sessionMode"
                        value={filters.sessionMode}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">All Session Types</option>
                        {sessionModes.map((mode) => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                      <select
                        name="priceRange"
                        value={filters.priceRange}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Any Price</option>
                        {priceRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                      <select
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Any Rating</option>
                        {ratings.map((rating) => (
                          <option key={rating} value={rating}>{rating}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={resetFilters}
                        className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimes />
                        <span>Reset Filters</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {counselors.length} {counselors.length === 1 ? "Professional Available" : "Professionals Available"}
            </h2>
            <div className="text-gray-600">Showing {counselors.length} results</div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
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
          ) : counselors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {counselors.map((counselor) => {
                  const isRequestSent = sentRequests.some((req) => req.counselorId._id === counselor._id);
                  return (
                    <motion.div
                      key={counselor._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={counselor.profilePictureUrl}
                            alt={counselor.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{counselor.fullName}</h3>
                            <p className="text-gray-500 flex items-center gap-1">
                              <FaUserTie className="text-teal-500" />
                              <span>Licensed Counselor</span>
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {counselor.specialization.slice(0, 3).map((spec) => (
                              <span key={spec} className="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {counselor.bio || "Licensed professional with extensive experience in counseling and mental health support."}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="text-teal-500" />
                            <span>{counselor.yearsOfExperience} years</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IoLanguage className="text-teal-500" />
                            <span>{counselor.languages.slice(0, 2).join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaMoneyBillWave className="text-teal-500" />
                            <span>${counselor.pricing?.perSession || "N/A"}/session</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Session Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {counselor.preferredSessionMode.map((mode) => (
                              <span key={mode} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                                {mode === "Video Call" && <FaVideo className="text-teal-500" />}
                                {mode === "Chat" && <FaComments className="text-teal-500" />}
                                {mode === "Audio Call" && <FaUserFriends className="text-teal-500" />}
                                {mode}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/counselor-profile/${counselor._id}`)}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
                          >
                            View Profile
                          </button>
                          {isRequestSent ? (
                            <div className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-center font-medium text-sm">
                              Request Already Sent
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSendRequest(counselor._id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium text-sm"
                            >
                              Send Request
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <img src="/no-results.svg" alt="No results" className="w-48 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Professionals Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn’t find any counselors matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FindCounselors;