// src/components/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "",
        highestQualification: "",
        specialization: [],
      });
      const { storeTokenInLS } = useAuth();
      const navigate = useNavigate();
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${backendUrl}/api/counselors/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              specialization: formData.specialization.length > 0 ? formData.specialization : ["Other"],
            }),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            if (data.status === 422) {
              toast.error(`Registration failed: ${data.extraDetails}`);
            } else if (data.errors && Array.isArray(data.errors)) {
              const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join(", ");
              toast.error(`Registration failed: ${errorMessages}`);
            } else {
              toast.error(`Registration failed: ${data.message || "Unknown error"}`);
            }
            return;
          }
    
          storeTokenInLS(data.token);
          toast.success("Registration successful! Redirecting to application...");
          setTimeout(() => navigate("/application"), 2000);
        } catch (error) {
          console.error("Registration error:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register as Counselor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            pattern="\d{10}"
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={formData.highestQualification}
            onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Qualification</option>
            <option value="Master’s Degree">Master’s Degree</option>
            <option value="Ph.D.">Ph.D.</option>
            <option value="Diploma">Diploma</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Specializations (comma separated, e.g., Mental Health, Career Counseling)"
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value.split(",").map(s => s.trim()) })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;