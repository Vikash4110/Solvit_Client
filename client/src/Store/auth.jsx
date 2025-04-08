// src/store/auth.js
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    setRole(null);
    localStorage.removeItem("token");
    setIsLoading(false);
  };

  const getUserRoleFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const counselorAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/counselors/profile`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Counselor authentication failed:", error);
      setUser(null);
    }
  };

  const clientAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/clients/profile`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Client authentication failed:", error);
      setUser(null);
    }
  };

  const adminAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/pending-applications`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUser({ role: "admin", applications: data }); // Store applications if needed
    } catch (error) {
      console.error("Admin authentication failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const tokenRole = getUserRoleFromToken();
    setRole(tokenRole);

    if (!token) {
      setIsLoading(false);
      setUser(null);
      setRole(null);
      return;
    }

    const authenticate = async () => {
      setIsLoading(true);
      if (tokenRole === "counselor") {
        await counselorAuthentication();
      } else if (tokenRole === "client") {
        await clientAuthentication();
      } else if (tokenRole === "admin") {
        await adminAuthentication();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    authenticate();
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, logoutUser, user, role, authorizationToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};

