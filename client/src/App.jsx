// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Store/auth";
import Register from "./Pages/CounselorRegister";
import Login from "./Pages/CounselorLogin";
import Application from "./Pages/CouselorApplication";
import Profile from "./Pages/CounselorProfile";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes> {/* No need for another <Router> */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/application" element={<Application />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
