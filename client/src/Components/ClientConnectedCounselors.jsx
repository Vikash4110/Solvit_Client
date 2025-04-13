// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";

// const ClientConnectedCounselors = () => {
//   const { authorizationToken } = useAuth();
//   const [counselors, setCounselors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchConnectedCounselors = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients/connected-counselors`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       setCounselors(data);
//     } catch (error) {
//       toast.error("Failed to load connected counselors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchConnectedCounselors();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Counselors</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : counselors.length === 0 ? (
//         <p>No connected counselors found.</p>
//       ) : (
//         <div className="grid gap-6">
//           {counselors.map((counselor) => (
//             <motion.div
//               key={counselor._id}
//               className="bg-white p-6 rounded-xl shadow-md"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <div className="flex flex-col md:flex-row gap-6">
//                 <img
//                   src={counselor.profilePictureUrl}
//                   alt={counselor.fullName}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold">{counselor.fullName}</h3>
//                   <p className="text-gray-600">Email: {counselor.email}</p>
//                   <p className="text-gray-600">Phone: {counselor.phoneNumber}</p>
//                   <p className="text-gray-600">Gender: {counselor.gender}</p>
//                   <p className="text-gray-600">
//                     Date of Birth: {counselor.dob ? new Date(counselor.dob).toLocaleDateString() : "N/A"}
//                   </p>
//                   <p className="text-gray-600">
//                     Address: {counselor.address.street || "N/A"}, {counselor.address.city || "N/A"}, {counselor.address.state || "N/A"}, {counselor.address.postalCode || "N/A"}
//                   </p>
//                   <p className="text-gray-600">Highest Qualification: {counselor.highestQualification}</p>
//                   <p className="text-gray-600">Specialization: {counselor.specialization.join(", ")}</p>
//                   <p className="text-gray-600">Years of Experience: {counselor.yearsOfExperience || "N/A"}</p>
//                   <p className="text-gray-600">Licensed: {counselor.isLicensed ? "Yes" : "No"}</p>
//                   {counselor.isLicensed && (
//                     <>
//                       <p className="text-gray-600">License Number: {counselor.licenseDetails.number || "N/A"}</p>
//                       <p className="text-gray-600">
//                         Issuing Authority: {counselor.licenseDetails.issuingAuthority || "N/A"}
//                       </p>
//                     </>
//                   )}
//                   <p className="text-gray-600">
//                     Availability: 
//                     {Object.entries(counselor.availability)
//                       .filter(([_, value]) => value)
//                       .map(([key]) => key)
//                       .join(", ") || "N/A"}
//                   </p>
//                   <p className="text-gray-600">
//                     Preferred Session Modes: {counselor.preferredSessionMode.join(", ") || "N/A"}
//                   </p>
//                   <p className="text-gray-600">
//                     Pricing: 
//                     {counselor.pricing.perSession ? `Per Session: ₹${counselor.pricing.perSession}` : ""}
//                     {counselor.pricing.subscription ? `, Subscription: ₹${counselor.pricing.subscription}` : ""}
//                     {counselor.pricing.customPricing ? `, Custom: ${counselor.pricing.customPricing}` : ""}
//                   </p>
//                   <p className="text-gray-600">Payment Method: {counselor.paymentMethod || "N/A"}</p>
//                   <p className="text-gray-600">Bio: {counselor.bio || "N/A"}</p>
//                   <p className="text-gray-600">Languages: {counselor.languages.join(", ") || "N/A"}</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClientConnectedCounselors;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import {
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaVideo,
  FaComments,
  FaUserFriends,
} from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";

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
      if (!response.ok) throw new Error("Failed to fetch connected counselors");
      const data = await response.json();

      // Process counselors with profile pictures
      const counselorsWithImages = await Promise.all(
        data.map(async (counselor) => {
          if (counselor.profilePicture) {
            try {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/counselors/file/${counselor.profilePicture}`,
                { headers: { Authorization: authorizationToken } }
              );
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

      setCounselors(counselorsWithImages);
    } catch (error) {
      console.error("Error fetching connected counselors:", error);
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Counselors</h1>
        
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
        ) : counselors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Connected Counselors</h3>
              <p className="text-gray-600 mb-6">
                You don't have any connected counselors at the moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.map((counselor) => (
              <motion.div
                key={counselor._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-teal-500" />
                      <span>{counselor.yearsOfExperience || "N/A"} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoLanguage className="text-teal-500" />
                      <span>{counselor.languages.slice(0, 2).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMoneyBillWave className="text-teal-500" />
                      <span>₹{counselor.pricing?.perSession || "N/A"}/session</span>
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientConnectedCounselors;