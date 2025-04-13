// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaTimes } from "react-icons/fa";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";

// const ClientSentRequests = () => {
//   const { authorizationToken } = useAuth();
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSentRequests = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/sent-requests`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       setRequests(data);
//     } catch (error) {
//       toast.error("Failed to load sent requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleWithdraw = async (requestId) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/withdraw-request/${requestId}`, {
//         method: "DELETE",
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message);
//       toast.success("Request withdrawn successfully");
//       setRequests(requests.filter((req) => req._id !== requestId));
//     } catch (error) {
//       toast.error(error.message || "Failed to withdraw request");
//     }
//   };

//   useEffect(() => {
//     fetchSentRequests();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Sent Requests</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : requests.length === 0 ? (
//         <p>No sent requests found.</p>
//       ) : (
//         <div className="grid gap-6">
//           {requests.map((req) => (
//             <motion.div
//               key={req._id}
//               className="bg-white p-6 rounded-xl shadow-md"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={req.counselorId.profilePictureUrl || "/default-profile.png"}
//                   alt={req.counselorId.fullName}
//                   className="w-12 h-12 rounded-full"
//                 />
//                 <div>
//                   <h3 className="text-xl font-semibold">{req.counselorId.fullName}</h3>
//                   <p className="text-gray-600">{req.counselorId.specialization.join(", ")}</p>
//                   <p className="text-sm text-gray-500">Status: {req.status}</p>
//                 </div>
//                 {req.status === "Pending" && (
//                   <button
//                     onClick={() => handleWithdraw(req._id)}
//                     className="ml-auto bg-red-600 text-white p-2 rounded-full"
//                   >
//                     <FaTimes />
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClientSentRequests;

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
      if (!response.ok) throw new Error("Failed to fetch sent requests");
      const data = await response.json();

      // Process counselors with profile pictures
      const requestsWithImages = await Promise.all(
        data.map(async (req) => {
          if (req.counselorId.profilePicture) {
            try {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/counselors/file/${req.counselorId.profilePicture}`,
                { headers: { Authorization: authorizationToken } }
              );
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

      setRequests(requestsWithImages);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sent Requests</h1>
        
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sent Requests</h3>
              <p className="text-gray-600 mb-6">
                You haven't sent any connection requests to counselors.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={req.counselorId.profilePictureUrl}
                      alt={req.counselorId.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{req.counselorId.fullName}</h3>
                      <p className="text-gray-600">{req.counselorId.specialization.join(", ")}</p>
                      <p className={`text-sm ${
                        req.status === "Pending" ? "text-yellow-600" :
                        req.status === "Accepted" ? "text-green-600" :
                        "text-red-600"
                      }`}>
                        Status: {req.status}
                      </p>
                    </div>
                    {req.status === "Pending" && (
                      <button
                        onClick={() => handleWithdraw(req._id)}
                        className="ml-auto bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center gap-2"
                      >
                        <FaTimes /> Withdraw
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSentRequests;