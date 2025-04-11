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
import FindCounselors from "./Components/FindCounselor";
import CounselorProfile from "./Components/CounselorShowProfile";
import AboutUs from "./Components/AboutUs";
import NotFoundPage from "./Pages/NotFoundPage";
import TermCondition from "./Components/TermCondition";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import ClientSentRequests from "./Components/ClientSentRequest";
import ClientConnectedCounselors from "./Components/ClientConnectedCounselors";
import CounselorPendingRequests from "./Components/CounselorPendingRequests";
import CounselorConnectedClients from "./Components/CounselorConnectedClients";
import WithdrawRequests from "./Components/WithdrawRequests";


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
          <Route path="/about" element={<AboutUs />} />
          <Route path="/counselor-register" element={<Register />} />
          <Route path="/counselor-login" element={<Login />} />
          <Route path="/counselor-application" element={<Application />} />
          <Route path="/counselor-profile" element={<Profile />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
          <Route path="/find-counselors" element={<FindCounselors />} />
          {/* ClientRoutes */}
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route
            path="/counselor-profile/:counselorId"
            element={<CounselorProfile />}
          />
          {/* AdminRoutes */}
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* 404 ErrorPage */}
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Catch-all route for 404 */}
          {/* Quick-Pages  */}
          <Route path="/term-condition" element={<TermCondition />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Req-Send Counselor-Client */}
          <Route
            path="/client-sent-requests"
            element={<ClientSentRequests />}
          />
          <Route
            path="/client-connected-counselors"
            element={<ClientConnectedCounselors />}
          />
          <Route
            path="/counselor-pending-requests"
            element={<CounselorPendingRequests />}
          />
          <Route
            path="/counselor-connected-clients"
            element={<CounselorConnectedClients />}
          />
          <Route path="/withdraw-requests" element={<WithdrawRequests />} />
        </Routes>
        
      </div>
    </AuthProvider>
  );
}

export default App;
