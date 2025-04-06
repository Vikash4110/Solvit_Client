import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Store/auth";
import Register from "./Pages/CounselorRegister";
import Login from "./Pages/CounselorLogin";
import Application from "./Pages/CouselorApplication";
import Profile from "./Pages/CounselorProfile";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Loader from "./Components/Loader"; 
import AdminPanel from "./Pages/AdminPanel"; 
import AdminLogin from "./Pages/AdminLogin"; 
import CounselorDashboard from "./Pages/CounselorDashboard"; 
import ClientRegister from "./Pages/ClientRegister";
import ClientLogin from "./Pages/ClientLogin";
import ClientDashboard from "./Pages/ClientDashboard";
import ClientProfile from "./Pages/ClientProfile";

import NotFoundPage from "./Pages/NotFoundPage";


function App() {
  const [isLoading, setIsLoading] = useState(false); // Start false, update based on session

  useEffect(() => {
    // Check if the loader has already been shown in this session
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (!hasLoaded) {
      setIsLoading(true); // Show loader only on first visit
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoaded", "true"); // Mark as loaded
      }, 2500); // 2.5 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, []);

  return (
    <AuthProvider>
      {isLoading && <Loader />}
      <div className={`${isLoading ? "hidden" : "block"}`}>
        <Navbar />
        <Routes>
        {/* CounselorRoutes */}
          <Route path="/" element={<Home />} />
          <Route path="/counselor-register" element={<Register />} />
          <Route path="/counselor-login" element={<Login />} />
          <Route path="/counselor-application" element={<Application />} />
          <Route path="/counselor-profile" element={<Profile />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} /> 
          {/* ClientRoutes */}
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          {/* AdminRoutes */}
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-login" element={<AdminLogin />} /> 
          {/* 404 ErrorPage */}
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 */}
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;