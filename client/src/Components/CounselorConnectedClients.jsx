// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../Store/auth";
// import { toast } from "sonner";
// import {
//   FaPaperPlane,
//   FaTimes,
//   FaCheck,
//   FaCheckDouble,
//   FaSearch,
//   FaPhoneAlt,
//   FaEllipsisV,
//   FaRegSmile,
//   FaPaperclip,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaLanguage,
//   FaInfoCircle,
// } from "react-icons/fa";
// import { IoMdTransgender } from "react-icons/io";
// import io from "socket.io-client";

// const CounselorConnectedClients = () => {
//   const { authorizationToken, user } = useAuth();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [clients, setClients] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const [unseenMessages, setUnseenMessages] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("all");
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!user) return;

//     socketRef.current = io(backendUrl, {
//       auth: { token: authorizationToken.replace("Bearer ", "") },
//     });

//     socketRef.current.on("connect", () => {
//       console.log("Connected to Socket.IO server:", socketRef.current.id);
//       socketRef.current.emit("joinRoom", user._id);
//     });

//     socketRef.current.on("userStatus", ({ userId, isOnline }) => {
//       setOnlineUsers((prev) => {
//         const updated = new Set(prev);
//         isOnline ? updated.add(userId) : updated.delete(userId);
//         return updated;
//       });
//     });

//     socketRef.current.on("receiveMessage", (message) => {
//       setMessages((prev) => {
//         const updated = [...prev, message];
//         scrollToBottom();
//         if (message.receiverId === user._id && !isChatOpen) {
//           setUnseenMessages((prev) => ({
//             ...prev,
//             [message.senderId]: (prev[message.senderId] || 0) + 1,
//           }));
//         }
//         return updated;
//       });
//       if (isChatOpen && selectedClient?._id === message.senderId) {
//         socketRef.current.emit("messageSeen", { messageId: message._id, receiverId: user._id });
//       }
//     });

//     socketRef.current.on("messageStatusUpdate", ({ messageId, status }) => {
//       setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg)));
//     });

//     socketRef.current.on("messageDeleted", ({ messageId }) => {
//       setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//     });

//     fetchConnectedClients();

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [user, authorizationToken, backendUrl, isChatOpen, selectedClient]);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredClients(clients);
//     } else {
//       const filtered = clients.filter((client) =>
//         client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         client.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredClients(filtered);
//     }
//   }, [searchTerm, clients]);

//   useEffect(() => {
//     if (activeTab === "all") {
//       setFilteredClients(clients);
//     } else if (activeTab === "online") {
//       setFilteredClients(clients.filter((client) => onlineUsers.has(client._id)));
//     }
//   }, [activeTab, clients, onlineUsers]);

//   const fetchConnectedClients = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/counselors/connected-clients`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error("Failed to fetch connected clients");
//       const data = await response.json();

//       const clientsWithImages = await Promise.all(
//         data.map(async (client) => {
//           if (client.profilePicture) {
//             try {
//               const imageResponse = await fetch(
//                 `${backendUrl}/api/clients/file/${client.profilePicture}`,
//                 { headers: { Authorization: authorizationToken } }
//               );
//               if (imageResponse.ok) {
//                 const blob = await imageResponse.blob();
//                 client.profilePictureUrl = URL.createObjectURL(blob);
//               } else {
//                 client.profilePictureUrl = "/default-profile.png";
//               }
//             } catch (error) {
//               client.profilePictureUrl = "/default-profile.png";
//             }
//           } else {
//             client.profilePictureUrl = "/default-profile.png";
//           }
//           return client;
//         })
//       );

//       setClients(clientsWithImages);
//       setFilteredClients(clientsWithImages);
//     } catch (error) {
//       console.error("Error fetching connected clients:", error);
//       toast.error("Failed to load connected clients");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (clientId) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/messages/messages/${user._id}/${clientId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch messages");
//       const data = await response.json();
//       setMessages(data.messages);
//       setTimeout(scrollToBottom, 0);
//     } catch (err) {
//       toast.error("Error fetching messages");
//     }
//   };

//   const handleOpenChat = (client) => {
//     setSelectedClient(client);
//     setIsChatOpen(true);
//     fetchMessages(client._id);
//     setUnseenMessages((prev) => ({ ...prev, [client._id]: 0 }));
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !user || !selectedClient) return;

//     const messageData = {
//       senderId: user._id,
//       receiverId: selectedClient._id,
//       message: newMessage,
//       senderModel: "Counselor",
//       receiverModel: "Client",
//     };

//     try {
//       const response = await fetch(`${backendUrl}/api/messages/send-message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify(messageData),
//       });
//       if (!response.ok) throw new Error("Failed to send message");
//       const data = await response.json();
//       setMessages((prev) => {
//         const updated = [...prev, { ...data.newMessage, status: "sent" }];
//         scrollToBottom();
//         return updated;
//       });
//       socketRef.current.emit("sendMessage", data.newMessage);
//       setNewMessage("");
//     } catch (err) {
//       toast.error("Error sending message");
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedClient(null);
//     setMessages([]);
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Your Clients</h1>
//             <p className="text-gray-600 mt-2">Manage and communicate with your clients</p>
//           </div>
//           <div className="relative w-full md:w-64 mt-4 md:mt-0">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search clients..."
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="flex space-x-2 mb-6">
//           <button
//             onClick={() => setActiveTab("all")}
//             className={`px-4 py-2 rounded-lg ${
//               activeTab === "all" ? "bg-teal-500 text-white" : "bg-white text-gray-700"
//             }`}
//           >
//             All Clients
//           </button>
//           <button
//             onClick={() => setActiveTab("online")}
//             className={`px-4 py-2 rounded-lg ${
//               activeTab === "online" ? "bg-teal-500 text-white" : "bg-white text-gray-700"
//             }`}
//           >
//             Online Now
//           </button>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
//                   <div className="flex-1 space-y-2">
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="h-3 bg-gray-200 rounded"></div>
//                   <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//                   <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredClients.length === 0 ? (
//           <motion.div
//             className="bg-white rounded-xl shadow-sm p-12 text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="max-w-md mx-auto">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 {activeTab === "online" ? "No Online Clients" : "No Clients Found"}
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {searchTerm
//                   ? "No clients match your search criteria."
//                   : activeTab === "online"
//                   ? "You don't have any clients currently online."
//                   : "You don't have any connected clients yet."}
//               </p>
//             </div>
//           </motion.div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredClients.map((client) => (
//               <motion.div
//                 key={client._id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 whileHover={{ y: -5 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="relative">
//                       <img
//                         src={client.profilePictureUrl}
//                         alt={client.fullName}
//                         className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
//                       />
//                       {onlineUsers.has(client._id) && (
//                         <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-gray-800">{client.fullName}</h3>
//                       <p className="text-gray-500 flex items-center gap-1 text-sm">
//                         <FaUser className="text-teal-500" />
//                         <span>{client.username}</span>
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {onlineUsers.has(client._id) ? (
//                           <span className="text-green-500">Active Now</span>
//                         ) : (
//                           <span className="text-gray-500">Offline</span>
//                         )}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="flex flex-wrap gap-2">
//                       {client.preferredLanguage && (
//                         <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
//                           {client.preferredLanguage}
//                         </span>
//                       )}
//                       {client.gender && (
//                         <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full font-medium">
//                           {client.gender}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3 mb-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <FaEnvelope className="text-teal-500" />
//                       <span>{client.email}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <FaPhone className="text-teal-500" />
//                       <span>{client.contactNumber || "N/A"}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <FaMapMarkerAlt className="text-teal-500" />
//                       <span>{client.address?.city || "N/A"}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <FaInfoCircle className="text-teal-500" />
//                       <span>Joined: {formatDate(client.createdAt)}</span>
//                     </div>
//                   </div>

//                   <motion.button
//                     onClick={() => handleOpenChat(client)}
//                     className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center gap-2"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FaPaperPlane /> Message
//                   </motion.button>
//                 </div>
//                 {unseenMessages[client._id] > 0 && (
//                   <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
//                     {unseenMessages[client._id]}
//                   </span>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         )}

//         <AnimatePresence>
//           {isChatOpen && (
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="relative bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ type: "spring", damping: 25 }}
//               >
//                 {/* Chat header */}
//                 <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={selectedClient?.profilePictureUrl}
//                       alt={selectedClient?.fullName}
//                       className="w-10 h-10 rounded-full object-cover border-2 border-white"
//                     />
//                     <div>
//                       <h3 className="font-bold">{selectedClient?.fullName}</h3>
//                       <p className="text-xs opacity-90">
//                         {onlineUsers.has(selectedClient?._id) ? (
//                           <span className="flex items-center gap-1">
//                             <span className="w-2 h-2 bg-green-300 rounded-full"></span>
//                             Online
//                           </span>
//                         ) : (
//                           <span>Offline</span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {/* <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full">
//                       <FaPhoneAlt />
//                     </button> */}
//                     <motion.button
//                       onClick={closeChat}
//                       className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
//                       whileHover={{ rotate: 90 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <FaTimes />
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Messages area */}
//                 <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                   {messages.length === 0 ? (
//                     <div className="h-full flex flex-col items-center justify-center text-gray-400">
//                       <FaPaperPlane className="text-4xl mb-2" />
//                       <p>No messages yet</p>
//                       <p className="text-sm">Start your conversation with {selectedClient?.fullName}</p>
//                     </div>
//                   ) : (
//                     messages.map((msg, index) => (
//                       <motion.div
//                         key={`${msg._id}-${index}`}
//                         className={`mb-3 flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <div
//                           className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
//                             msg.senderId === user._id
//                               ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-br-none"
//                               : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
//                           }`}
//                         >
//                           <p className="text-sm">{msg.message}</p>
//                           <div className="flex items-center justify-end mt-1">
//                             <span
//                               className={`text-xs ${
//                                 msg.senderId === user._id ? "text-white text-opacity-70" : "text-gray-400"
//                               }`}
//                             >
//                               {formatTime(msg.createdAt)}
//                             </span>
//                             {msg.senderId === user._id && (
//                               <span className="ml-1">
//                                 {msg.status === "sent" && (
//                                   <FaCheck className="text-white text-opacity-70" size={10} />
//                                 )}
//                                 {msg.status === "delivered" && (
//                                   <FaCheckDouble className="text-white text-opacity-70" size={10} />
//                                 )}
//                                 {msg.status === "seen" && (
//                                   <FaCheckDouble className="text-blue-200" size={10} />
//                                 )}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Message input */}
//                 <div className="p-4 border-t border-gray-200 bg-white">
//                   <div className="flex items-center gap-2">
//                     {/* <button className="p-2 text-gray-500 hover:text-teal-500 rounded-full hover:bg-gray-100">
//                       <FaRegSmile />
//                     </button> */}
//                     {/* <button className="p-2 text-gray-500 hover:text-teal-500 rounded-full hover:bg-gray-100">
//                       <FaPaperclip />
//                     </button> */}
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder="Type your message..."
//                       className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                       onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     />
//                     <motion.button
//                       onClick={handleSendMessage}
//                       className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       disabled={!newMessage.trim()}
//                     >
//                       <FaPaperPlane />
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CounselorConnectedClients;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Store/auth";
import { toast } from "sonner";
import {
  FaPaperPlane,
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaSearch,
  FaPhoneAlt,
  FaEllipsisV,
  FaRegSmile,
  FaPaperclip,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLanguage,
  FaInfoCircle,
} from "react-icons/fa";
import { IoMdTransgender } from "react-icons/io";
import io from "socket.io-client";

const CounselorConnectedClients = () => {
  const { authorizationToken, user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unseenMessages, setUnseenMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(backendUrl, {
      auth: { token: authorizationToken.replace("Bearer ", "") },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server:", socketRef.current.id);
      socketRef.current.emit("joinRoom", user._id);
    });

    socketRef.current.on("userStatus", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        isOnline ? updated.add(userId) : updated.delete(userId);
        return updated;
      });
    });

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        scrollToBottom();
        if (message.receiverId === user._id && !isChatOpen) {
          setUnseenMessages((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }));
        }
        return updated;
      });
      if (isChatOpen && selectedClient?._id === message.senderId) {
        socketRef.current.emit("messageSeen", { messageId: message._id, receiverId: user._id });
      }
    });

    socketRef.current.on("messageStatusUpdate", ({ messageId, status }) => {
      setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg)));
    });

    socketRef.current.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    fetchConnectedClients();

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, authorizationToken, backendUrl, isChatOpen, selectedClient]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredClients(clients);
    } else if (activeTab === "online") {
      setFilteredClients(clients.filter((client) => onlineUsers.has(client._id)));
    }
  }, [activeTab, clients, onlineUsers]);

  const fetchConnectedClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/counselors/connected-clients`, {
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error("Failed to fetch connected clients");
      const data = await response.json();

      const clientsWithImages = await Promise.all(
        data.map(async (client) => {
          if (client.profilePicture) {
            try {
              const imageResponse = await fetch(
                `${backendUrl}/api/clients/file/${client.profilePicture}`,
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
      setFilteredClients(clientsWithImages);
    } catch (error) {
      console.error("Error fetching connected clients:", error);
      toast.error("Failed to load connected clients");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId) => {
    try {
      const response = await fetch(`${backendUrl}/api/messages/messages/${user._id}/${clientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
      setTimeout(scrollToBottom, 0);
    } catch (err) {
      toast.error("Error fetching messages");
    }
  };

  const handleOpenChat = (client) => {
    setSelectedClient(client);
    setIsChatOpen(true);
    fetchMessages(client._id);
    setUnseenMessages((prev) => ({ ...prev, [client._id]: 0 }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedClient) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedClient._id,
      message: newMessage,
      senderModel: "Counselor",
      receiverModel: "Client",
    };

    try {
      const response = await fetch(`${backendUrl}/api/messages/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const data = await response.json();
      setMessages((prev) => {
        const updated = [...prev, { ...data.newMessage, status: "sent" }];
        scrollToBottom();
        return updated;
      });
      socketRef.current.emit("sendMessage", data.newMessage);
      setNewMessage("");
    } catch (err) {
      toast.error("Error sending message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedClient(null);
    setMessages([]);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Clients</h1>
            <p className="text-gray-600 mt-2">Manage and communicate with your clients</p>
          </div>
          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => setActiveTab("online")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "online" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Online Now
          </button>
        </div>

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
        ) : filteredClients.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {activeTab === "online" ? "No Online Clients" : "No Clients Found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "No clients match your search criteria."
                  : activeTab === "online"
                  ? "You don't have any clients currently online."
                  : "You don't have any connected clients yet."}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <motion.div
                key={client._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={client.profilePictureUrl}
                        alt={client.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
                      />
                      {onlineUsers.has(client._id) && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{client.fullName}</h3>
                      <p className="text-gray-500 flex items-center gap-1 text-sm">
                        <FaUser className="text-indigo-600" />
                        <span>{client.username}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {onlineUsers.has(client._id) ? (
                          <span className="text-green-500">Active Now</span>
                        ) : (
                          <span className="text-gray-500">Offline</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {client.preferredLanguage && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                          {client.preferredLanguage}
                        </span>
                      )}
                      {client.gender && (
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                          {client.gender}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-indigo-600" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-indigo-600" />
                      <span>{client.contactNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-indigo-600" />
                      <span>{client.address?.city || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaInfoCircle className="text-indigo-600" />
                      <span>Joined: {formatDate(client.createdAt)}</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleOpenChat(client)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane /> Message
                  </motion.button>
                </div>
                {unseenMessages[client._id] > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unseenMessages[client._id]}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                {/* Chat header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedClient?.profilePictureUrl}
                      alt={selectedClient?.fullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <h3 className="font-bold">{selectedClient?.fullName}</h3>
                      <p className="text-xs opacity-90">
                        {onlineUsers.has(selectedClient?._id) ? (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                            Online
                          </span>
                        ) : (
                          <span>Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={closeChat}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <FaPaperPlane className="text-4xl mb-2" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start your conversation with {selectedClient?.fullName}</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        key={`${msg._id}-${index}`}
                        className={`mb-3 flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-2xl p-3 ${
                            msg.senderId === user._id
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none"
                              : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <div className="flex items-center justify-end mt-1">
                            <span
                              className={`text-xs ${
                                msg.senderId === user._id ? "text-white text-opacity-70" : "text-gray-400"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </span>
                            {msg.senderId === user._id && (
                              <span className="ml-1">
                                {msg.status === "sent" && (
                                  <FaCheck className="text-white text-opacity-70" size={10} />
                                )}
                                {msg.status === "delivered" && (
                                  <FaCheckDouble className="text-white text-opacity-70" size={10} />
                                )}
                                {msg.status === "seen" && (
                                  <FaCheckDouble className="text-indigo-200" size={10} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!newMessage.trim()}
                    >
                      <FaPaperPlane />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CounselorConnectedClients;