// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";

// const CounselorConnectedClients = () => {
//   const { authorizationToken } = useAuth();
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchConnectedClients = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counselors/connected-clients`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error("Failed to fetch connected clients");
//       const data = await response.json();
//       setClients(data);
//     } catch (error) {
//       toast.error("Failed to load connected clients");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchConnectedClients();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Clients</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : clients.length === 0 ? (
//         <p>No connected clients found.</p>
//       ) : (
//         <div className="grid gap-6">
//           {clients.map((client) => (
//             <motion.div
//               key={client._id}
//               className="bg-white p-6 rounded-xl shadow-md"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               <div className="flex flex-col md:flex-row gap-6">
//                 <img
//                   src={client.profilePictureUrl}
//                   alt={client.fullName}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold">{client.fullName}</h3>
//                   <p className="text-gray-600">Email: {client.email}</p>
//                   <p className="text-gray-600">Username: {client.username}</p>
//                   <p className="text-gray-600">Gender: {client.gender}</p>
//                   <p className="text-gray-600">
//                     Date of Birth: {new Date(client.dob).toLocaleDateString()}
//                   </p>
//                   <p className="text-gray-600">Contact: {client.contactNumber}</p>
//                   <p className="text-gray-600">
//                     Address: {client.address.street}, {client.address.city}, {client.address.state}, {client.address.postalCode}
//                   </p>
//                   <p className="text-gray-600">Preferred Language: {client.preferredLanguage}</p>
//                   {client.otherLanguage && (
//                     <p className="text-gray-600">Other Language: {client.otherLanguage}</p>
//                   )}
//                   <p className="text-gray-600">Heard About Us: {client.howHeardAboutUs}</p>
//                   {client.referralCode && (
//                     <p className="text-gray-600">Referral Code: {client.referralCode}</p>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CounselorConnectedClients;

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
      if (!response.ok) throw new Error("Failed to fetch connected clients");
      const data = await response.json();

      // Process clients with profile pictures
      const clientsWithImages = await Promise.all(
        data.map(async (client) => {
          if (client.profilePicture) {
            try {
              const imageResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/clients/file/${client.profilePicture}`,
                { headers: { Authorization: authorizationToken } }
              );
              if (imageResponse.ok) {
                const blob = await imageResponse.blob();
                client.profilePictureUrl = URL.createObjectURL(blob);
              } else {
                client.profilePictureUrl = "/default-profile.png";
              }
            } catch (error) {
              client.profilePictureUrl = "/default-profile.png";
            }
          } else {
            client.profilePictureUrl = "/default-profile.png";
          }
          return client;
        })
      );

      setClients(clientsWithImages);
    } catch (error) {
      console.error("Error fetching connected clients:", error);
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Connected Clients</h1>
        
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
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Connected Clients</h3>
              <p className="text-gray-600 mb-6">
                You don't have any connected clients at the moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {clients.map((client) => (
              <motion.div
                key={client._id}
                className="bg-white p-6 rounded-xl shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={client.profilePictureUrl}
                    alt={client.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{client.fullName}</h3>
                    <p className="text-gray-600">Email: {client.email}</p>
                    <p className="text-gray-600">Username: {client.username}</p>
                    <p className="text-gray-600">Gender: {client.gender}</p>
                    <p className="text-gray-600">
                      Date of Birth: {new Date(client.dob).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">Contact: {client.contactNumber}</p>
                    <p className="text-gray-600">
                      Address: {client.address.street}, {client.address.city}, {client.address.state}, {client.address.postalCode}
                    </p>
                    <p className="text-gray-600">Preferred Language: {client.preferredLanguage}</p>
                    {client.otherLanguage && (
                      <p className="text-gray-600">Other Language: {client.otherLanguage}</p>
                    )}
                    <p className="text-gray-600">Heard About Us: {client.howHeardAboutUs}</p>
                    {client.referralCode && (
                      <p className="text-gray-600">Referral Code: {client.referralCode}</p>
                    )}
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

export default CounselorConnectedClients;