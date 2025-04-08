import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHome,
  FaCalendarCheck,
  FaComments,
  FaFileAlt,
  FaSignOutAlt,
  FaSearch,
  FaChartLine,
  FaEnvelope,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";
import FindCounselors from "../Components/FindCounselor";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser, isLoading, role } = useAuth();

  useEffect(() => {
    if (!isLoading && role !== "client") {
      toast.error("Access denied. Clients only.");
      navigate("/");
    }
    console.log("User data in dashboard:", user);
  }, [isLoading, role, navigate, user]);

  const NavItem = ({ icon, label, active, onClick }) => (
    <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
      <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-200 font-medium ${
          active
            ? "bg-teal-50 text-teal-600 font-semibold"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        }`}
      >
        <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-teal-500" : "text-gray-500"}`}>
          {icon}
        </span>
        {label}
      </button>
    </motion.div>
  );

  const StatCard = ({ icon, value, label, change, onClick }) => (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600">{label}</p>
        </div>
        <div className="p-3 rounded-lg bg-opacity-20 bg-gray-200">{icon}</div>
      </div>
      <p className={`text-xs mt-2 ${change.startsWith("+") ? "text-green-500" : "text-blue-500"}`}>{change}</p>
    </motion.div>
  );

  const DashboardHome = ({ user, setActiveTab }) => {
    const stats = [
      { icon: <FaCalendarCheck className="text-green-500" />, value: "3", label: "Upcoming Sessions", change: "1 tomorrow", onClick: () => setActiveTab("sessions") },
      { icon: <FaComments className="text-blue-500" />, value: "12", label: "Messages", change: "2 unread", onClick: () => setActiveTab("messages") },
      { icon: <FaFileAlt className="text-purple-500" />, value: "5", label: "Session History", change: "+1 this week", onClick: () => setActiveTab("history") },
      { icon: <FaMoneyBillWave className="text-orange-500" />, value: "$150", label: "Pending Payments", change: "Due this week", onClick: () => setActiveTab("payments") },
    ];

    return (
      <div className="space-y-8">
        <motion.div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg p-6 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName || "Client"}!</h2>
              <p className="opacity-90 max-w-lg">Your personal dashboard to manage sessions, messages, and payments.</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaChartLine className="text-xl" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} change={stat.change} onClick={stat.onClick} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <FaCalendarCheck />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Session Scheduled</h4>
                <p className="text-sm text-gray-600">Meeting with Dr. Jane Doe tomorrow at 3 PM</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">1 hour ago</span>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FaEnvelope />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">New Message</h4>
                <p className="text-sm text-gray-600">Received from your counselor</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/client-login");
  };

  const tabConfig = [
    { id: "home", label: "Dashboard", icon: <FaHome className="w-4 h-4" /> },
    { id: "sessions", label: "Sessions", icon: <FaCalendarCheck className="w-4 h-4" /> },
    { id: "messages", label: "Messages", icon: <FaComments className="w-4 h-4" /> },
    { id: "history", label: "History", icon: <FaFileAlt className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <FaMoneyBillWave className="w-4 h-4" /> },
    { id: "find-counselors", label: "Find Counselors", icon: <FaUsers className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome user={user} setActiveTab={setActiveTab} />;
      case "sessions":
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"><h3 className="text-xl font-medium text-gray-600">Manage Your Sessions</h3><p className="text-gray-500 mt-2">View and schedule upcoming counseling sessions.</p></div>;
      case "messages":
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"><h3 className="text-xl font-medium text-gray-600">Messages</h3><p className="text-gray-500 mt-2">Communicate with your counselor here.</p></div>;
      case "history":
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"><h3 className="text-xl font-medium text-gray-600">Session History</h3><p className="text-gray-500 mt-2">Review past sessions and notes.</p></div>;
      case "payments":
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"><h3 className="text-xl font-medium text-gray-600">Payment Management</h3><p className="text-gray-500 mt-2">Track and manage your payments.</p></div>;
      case "find-counselors":
        return <FindCounselors />; // Render the imported FindCounselors component
      default:
        return <DashboardHome user={user} setActiveTab={setActiveTab} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-teal-400 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user || !user.fullName) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600">Unable to load user data. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-teal-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      <motion.aside
        className={`w-64 bg-white shadow-lg p-6 flex flex-col justify-between fixed h-full border-r border-gray-200 z-10 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="mb-10 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-500 p-2 rounded-lg">
                <FaUser className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">CounselPro</h2>
            </div>
            <p className="text-xs text-gray-500 bg-teal-50 px-2 py-1 rounded-full">Client Dashboard</p>
          </div>

          <nav className="space-y-2">
            {tabConfig.map((tab) => (
              <NavItem
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-3 rounded-lg transition-all duration-300 font-medium text-red-500 hover:bg-red-50"
          >
            <FaSignOutAlt className="w-4 h-4" /> Logout
          </button>

          <div className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500">Client</p>
            </div>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 md:ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {tabConfig.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
          </h1>
          {/* <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                {user.fullName.charAt(0)}
              </div>
              <span className="font-medium text-gray-700 hidden md:inline">{user.fullName}</span>
            </div>
          </div> */}
        </div>

        <div className="p-6">
          {activeTab !== "home" && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {renderTabContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;