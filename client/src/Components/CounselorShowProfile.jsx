// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaEnvelope,
//   FaLanguage,
//   FaVideo,
//   FaClock,
//   FaUserGraduate,
//   FaStar,
//   FaVenusMars,
//   FaBirthdayCake,
//   FaMoneyBillWave,
//   FaCreditCard,
// } from "react-icons/fa";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuth } from "../Store/auth";

// const CounselorProfile = () => {
//   const { counselorId } = useParams();
//   const navigate = useNavigate();
//   const { authorizationToken, role, isLoading: authLoading } = useAuth();
//   const [counselor, setCounselor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!authLoading && role !== "client") {
//       toast.error("Access denied. Clients only.");
//       navigate("/client-login");
//     }
//   }, [authLoading, role, navigate]);

//   const fetchCounselorProfile = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?_id=${counselorId}`,
//         { headers: { Authorization: authorizationToken } }
//       );
//       if (!response.ok) throw new Error("Failed to fetch counselor profile");
//       const data = await response.json();

//       if (data.length === 0) throw new Error("Counselor not found");

//       const counselorData = data[0];

//       if (counselorData.profilePicture) {
//         const imageResponse = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselorData.profilePicture}`,
//           { headers: { Authorization: authorizationToken } }
//         );
//         if (imageResponse.ok) {
//           const blob = await imageResponse.blob();
//           counselorData.profilePictureUrl = URL.createObjectURL(blob);
//         } else {
//           counselorData.profilePictureUrl = "https://via.placeholder.com/150";
//         }
//       } else {
//         counselorData.profilePictureUrl = "https://via.placeholder.com/150";
//       }

//       setCounselor(counselorData);
//     } catch (error) {
//       console.error("Error fetching counselor profile:", error);
//       toast.error("Failed to load counselor profile");
//       navigate("/find-counselors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!authLoading) fetchCounselorProfile();
//   }, [counselorId, authorizationToken, authLoading]);

//   if (authLoading || loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-32 w-32 bg-teal-200 rounded-full mb-6"></div>
//           <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!counselor) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg font-medium">Counselor not found.</p>
//       </div>
//     );
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         className="max-w-5xl mx-auto"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-32 h-32 bg-teal-200 rounded-full opacity-10 -translate-x-1/2 translate-y-1/2 blur-xl"></div>
//           <div className="flex flex-col md:flex-row items-center gap-8">
//             <motion.img
//               src={counselor.profilePictureUrl}
//               alt={counselor.fullName}
//               className="w-48 h-48 rounded-full object-cover border-4 border-teal-500 shadow-lg"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//             />
//             <div className="text-center md:text-left flex-1">
//               <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
//                 {counselor.fullName}
//               </h1>
//               <p className="text-xl text-gray-600 mb-3">{counselor.specialization.join(", ")}</p>
//               <div className="flex items-center justify-center md:justify-start gap-2">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar
//                     key={i}
//                     className={i < 4.8 ? "text-yellow-400" : "text-gray-300"} // Placeholder rating
//                   />
//                 ))}
//                 <span className="text-sm text-gray-500 ml-2">4.8 (120 reviews)</span>
//               </div>
//             </div>
//             <motion.button
//               onClick={() => navigate("/client-dashboard")}
//               className="bg-gray-700 text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-all shadow-md font-semibold"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Back to Dashboard
//             </motion.button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: Counselor Details */}
//           <motion.div
//             className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-gray-100 p-8"
//             variants={cardVariants}
//           >
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6">Counselor Details</h2>
//             <div className="space-y-6 text-gray-700">
//               {[
//                 { icon: <FaVenusMars />, label: "Gender", value: counselor.gender },
//                 {
//                   icon: <FaBirthdayCake />,
//                   label: "Date of Birth",
//                   value: counselor.dob ? new Date(counselor.dob).toLocaleDateString() : "Not provided",
//                 },
//                 {
//                   icon: <FaUserGraduate />,
//                   label: "Qualification",
//                   value: counselor.highestQualification,
//                 },
//                 {
//                   icon: <FaUserGraduate />,
//                   label: "Experience",
//                   value: `${counselor.yearsOfExperience} years`,
//                 },
//                 { icon: <FaLanguage />, label: "Languages", value: counselor.languages.join(", ") },
//                 {
//                   icon: <FaVideo />,
//                   label: "Session Modes",
//                   value: counselor.preferredSessionMode.join(", "),
//                 },
//                 { icon: <FaEnvelope />, label: "Email", value: counselor.email },
//                 {
//                   icon: <FaStar />,
//                   label: "Licensed",
//                   value: counselor.isLicensed ? "Yes" : "No",
//                   extra: counselor.isLicensed && counselor.licenseDetails?.number && (
//                     <p className="text-sm text-gray-500 mt-1">License: {counselor.licenseDetails.number}</p>
//                   ),
//                 },
//               ].map((item, idx) => (
//                 <div key={idx} className="flex items-start gap-4">
//                   <div className="text-teal-500 text-xl">{item.icon}</div>
//                   <div>
//                     <p className="font-medium text-gray-800">{item.label}</p>
//                     <p className="text-gray-600">{item.value}</p>
//                     {item.extra}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Right Column: Bio, Pricing, Actions */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Bio */}
//             <motion.div
//               className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
//               variants={cardVariants}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
//               <p className="text-gray-600 leading-relaxed">
//                 {counselor.bio ||
//                   `I’m a dedicated counselor with over ${counselor.yearsOfExperience} years of experience in ${counselor.specialization.join(
//                     " and "
//                   )}. My approach is client-centered, focusing on creating a safe and supportive environment to help you achieve your goals.`}
//               </p>
//             </motion.div>

//             {/* Pricing */}
//             <motion.div
//               className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
//               variants={cardVariants}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Session Rates & Payment</h2>
//               <div className="space-y-6 text-gray-700">
//                 {[
//                   { icon: <FaMoneyBillWave />, label: "Per Session", value: `$${counselor.pricing?.perSession || "N/A"}` },
//                   {
//                     icon: <FaMoneyBillWave />,
//                     label: "Subscription",
//                     value: `$${counselor.pricing?.subscription || "N/A"} / month`,
//                   },
//                   ...(counselor.pricing?.customPricing
//                     ? [{ icon: <FaMoneyBillWave />, label: "Custom Pricing", value: counselor.pricing.customPricing }]
//                     : []),
//                   { icon: <FaCreditCard />, label: "Payment Method", value: counselor.paymentMethod || "Not specified" },
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex items-start gap-4">
//                     <div className="text-teal-500 text-xl">{item.icon}</div>
//                     <div>
//                       <p className="font-medium text-gray-800">{item.label}</p>
//                       <p className="text-gray-600">{item.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Actions */}
//             <motion.div
//               className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
//               variants={cardVariants}
//             >
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Started</h2>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <motion.button
//                   onClick={() => toast.info("Booking functionality coming soon!")}
//                   className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white py-3 px-8 rounded-full hover:from-teal-600 hover:to-indigo-700 transition-all shadow-lg font-semibold"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Book a Session
//                 </motion.button>
//                 <motion.button
//                   onClick={() => toast.info("Messaging functionality coming soon!")}
//                   className="bg-gray-100 text-gray-800 py-3 px-8 rounded-full hover:bg-gray-200 transition-all shadow-lg font-semibold"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Send Message
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* Availability Section */}
//         <motion.div
//           className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-8"
//           variants={cardVariants}
//         >
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">Availability</h2>
//           <div className="flex items-start gap-4 text-gray-700">
//             <FaClock className="text-teal-500 text-xl" />
//             <p className="text-gray-600 leading-relaxed">
//               {counselor.availability
//                 ? `${counselor.availability.weekdays ? "Weekdays" : ""} ${
//                     counselor.availability.weekends ? "Weekends" : ""
//                   } - ${counselor.availability.morning ? "Morning" : ""} ${
//                     counselor.availability.afternoon ? "Afternoon" : ""
//                   } ${counselor.availability.evening ? "Evening" : ""}`
//                 : "Availability not specified"}
//             </p>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default CounselorProfile;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLanguage,
  FaVideo,
  FaClock,
  FaUserGraduate,
  FaStar,
  FaVenusMars,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaCreditCard,
  FaCalendarAlt,
  FaComments,
  FaCheckCircle,
  FaArrowLeft
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const CounselorProfile = () => {
  const { counselorId } = useParams();
  const navigate = useNavigate();
  const { authorizationToken, role, isLoading: authLoading } = useAuth();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/client-login");
    }
  }, [authLoading, role, navigate]);

  const fetchCounselorProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/clients/find-counselors?_id=${counselorId}`,
        { headers: { Authorization: authorizationToken } }
      );
      if (!response.ok) throw new Error("Failed to fetch counselor profile");
      const data = await response.json();

      if (data.length === 0) throw new Error("Counselor not found");

      const counselorData = data[0];

      if (counselorData.profilePicture) {
        const imageResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/clients/counselor-file/${counselorData.profilePicture}`,
          { headers: { Authorization: authorizationToken } }
        );
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          counselorData.profilePictureUrl = URL.createObjectURL(blob);
        } else {
          counselorData.profilePictureUrl = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60";
        }
      } else {
        counselorData.profilePictureUrl = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60";
      }

      setCounselor(counselorData);
    } catch (error) {
      console.error("Error fetching counselor profile:", error);
      toast.error("Failed to load counselor profile");
      navigate("/find-counselors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchCounselorProfile();
  }, [counselorId, authorizationToken, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-teal-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-teal-200 rounded-full mb-6"></div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!counselor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-teal-50">
        <p className="text-gray-600 text-lg font-medium">Counselor not found.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      },
    },
  };

  const ratingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 relative overflow-hidden"
          variants={cardVariants}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={counselor.profilePictureUrl}
                alt={counselor.fullName}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white rounded-full p-2 shadow-md">
                <FaComments className="text-lg" />
              </div>
            </motion.div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {counselor.fullName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                {counselor.specialization.map((spec, index) => (
                  <span 
                    key={index} 
                    className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1">
                {ratingStars(4.8)}
                <span className="text-sm text-gray-500 ml-2">4.8 (120 reviews)</span>
              </div>
            </div>
            
            <motion.button
              onClick={() => navigate("/client-dashboard")}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-200 transition-all shadow-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft /> Back to Dashboard
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Counselor Details */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={cardVariants}
              custom={0.1}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUserGraduate className="text-teal-500" /> Professional Details
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <FaVenusMars className="text-teal-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Gender</p>
                    <p className="text-gray-600">{counselor.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaUserGraduate className="text-teal-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Qualification</p>
                    <p className="text-gray-600">{counselor.highestQualification}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaClock className="text-teal-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Experience</p>
                    <p className="text-gray-600">{counselor.yearsOfExperience} years</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FaLanguage className="text-teal-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Languages</p>
                    <p className="text-gray-600">{counselor.languages.join(", ")}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={cardVariants}
              custom={0.2}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-teal-500" /> Availability
              </h2>
              <div className="flex items-start gap-3 text-gray-700">
                <FaClock className="text-teal-500 mt-1" />
                <div>
                  {counselor.availability ? (
                    <>
                      <p className="font-medium text-gray-800">Available</p>
                      <p className="text-gray-600">
                        {[
                          counselor.availability.weekdays && "Weekdays",
                          counselor.availability.weekends && "Weekends"
                        ].filter(Boolean).join(" & ")}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {[
                          counselor.availability.morning && "Morning",
                          counselor.availability.afternoon && "Afternoon",
                          counselor.availability.evening && "Evening"
                        ].filter(Boolean).join(", ")}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-600">Availability not specified</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={cardVariants}
              custom={0.3}
              whileHover="hover"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaVideo className="text-teal-500" /> Session Options
              </h2>
              <div className="flex flex-wrap gap-2">
                {counselor.preferredSessionMode.map((mode, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio, Pricing, Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={cardVariants}
              custom={0.1}
              whileHover="hover"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Profile</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="leading-relaxed mb-4">
                  {counselor.bio || `I'm a dedicated counselor with over ${counselor.yearsOfExperience} years of experience specializing in ${counselor.specialization.join(" and ")}. My approach is client-centered, focusing on creating a safe and supportive environment to help you achieve your goals.`}
                </p>
                {counselor.isLicensed && (
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r">
                    <p className="font-medium text-teal-800">Licensed Professional</p>
                    {counselor.licenseDetails?.number && (
                      <p className="text-sm text-teal-700">License #: {counselor.licenseDetails.number}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              variants={cardVariants}
              custom={0.2}
              whileHover="hover"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Session Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100">
                  <h3 className="font-bold text-gray-800 mb-2">Single Session</h3>
                  <p className="text-3xl font-bold text-teal-600 mb-3">
                    ${counselor.pricing?.perSession || "75"}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>50-60 minute session</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>Flexible scheduling</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-gray-800 mb-2">Monthly Package</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-3">
                    ${counselor.pricing?.subscription || "250"}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>4 sessions per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Priority scheduling</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-2">Payment Options</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <FaCreditCard className="text-purple-500 text-2xl" />
                    <span className="text-gray-700">{counselor.paymentMethod || "Credit/Debit Cards"}</span>
                  </div>
                  <p className="text-sm text-gray-500">Secure payment processing</p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white"
              variants={cardVariants}
              custom={0.3}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to Begin Your Journey?</h2>
                  <p className="opacity-90">Take the first step towards positive change today</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <motion.button
                    onClick={() => toast.info("Booking functionality coming soon!")}
                    className="bg-white text-teal-700 py-4 px-8 rounded-full hover:bg-gray-100 transition-all font-bold shadow-lg w-full text-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Book Session
                  </motion.button>
                  <motion.button
                    onClick={() => toast.info("Messaging functionality coming soon!")}
                    className="bg-transparent border-2 border-white text-white py-4 px-8 rounded-full hover:bg-white hover:bg-opacity-10 transition-all font-bold shadow-lg w-full text-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CounselorProfile;