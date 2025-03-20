// src/components/Application.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Application = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    highestQualification: "",
    specialization: [],
    dob: "",
    address: { street: "", city: "", state: "", postalCode: "" },
    yearsOfExperience: "",
    isLicensed: false,
    licenseDetails: { number: "", issuingAuthority: "" },
    certifications: [],
    availability: { weekdays: false, weekends: false, morning: false, afternoon: false, evening: false },
    preferredSessionMode: [],
    pricing: { perSession: "", subscription: "", customPricing: "" },
    paymentMethod: "",
    bankDetails: { accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "" },
    bio: "",
    languages: [],
  });
  const [files, setFiles] = useState({
    resume: null,
    degreeCertificate: null,
    licenseCertification: null,
    governmentId: null,
    profilePicture: null,
  });
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/counselors/profile`, {
          method: "GET",
          headers: { Authorization: authorizationToken },
        });
        if (response.ok) {
          const profileData = await response.json();
          setFormData(prev => ({
            ...prev,
            fullName: profileData.fullName || "",
            email: profileData.email || "",
            phoneNumber: profileData.phoneNumber || "",
            gender: profileData.gender || "",
            highestQualification: profileData.highestQualification || "",
            specialization: profileData.specialization || [],
          }));
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error loading profile data");
      }
    };
    fetchProfile();
  }, [authorizationToken]);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0] || null;
    console.log(`Selected file for ${name}:`, file ? file.name : "No file");
    setFiles(prev => ({
      ...prev,
      [name]: file,
    }));
  };

  const validateForm = () => {
    if (!formData.dob) return "Date of Birth is required";
    if (!formData.address.street) return "Street is required";
    if (!formData.address.city) return "City is required";
    if (!formData.address.state) return "State is required";
    if (!formData.address.postalCode || !/^\d{6}$/.test(formData.address.postalCode)) return "Postal code must be 6 digits";
    if (formData.yearsOfExperience === "" || isNaN(Number(formData.yearsOfExperience)) || Number(formData.yearsOfExperience) < 0) {
      return "Years of experience must be a non-negative number";
    }
    if (formData.preferredSessionMode.length === 0 || !formData.preferredSessionMode.every(mode => ["Video Call", "Chat", "Audio Call"].includes(mode))) {
      return "At least one valid session mode (Video Call, Chat, Audio Call) is required";
    }
    if (!["Bank Transfer", "UPI", "PayPal", "Other"].includes(formData.paymentMethod)) return "Payment method is required";
    if (formData.bio.length < 10) return "Bio must be at least 10 characters";
    if (formData.languages.length === 0) return "At least one language is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    console.log("Current files state:", JSON.stringify({
      resume: files.resume?.name,
      degreeCertificate: files.degreeCertificate?.name,
      licenseCertification: files.licenseCertification?.name,
      governmentId: files.governmentId?.name,
      profilePicture: files.profilePicture?.name,
    }, null, 2));

    const fileNames = Object.values(files).filter(f => f).map(f => f.name);
    const uniqueFileNames = new Set(fileNames);
    if (fileNames.length > 1 && uniqueFileNames.size < fileNames.length) {
      toast.error("Duplicate files detected. Please upload distinct files for each field.");
      return;
    }

    const data = new FormData();
    data.append("dob", new Date(formData.dob).toISOString());
    data.append("address", JSON.stringify(formData.address));
    data.append("yearsOfExperience", Number(formData.yearsOfExperience));
    data.append("isLicensed", formData.isLicensed.toString());
    if (formData.isLicensed && (formData.licenseDetails.number || formData.licenseDetails.issuingAuthority)) {
      data.append("licenseDetails", JSON.stringify(formData.licenseDetails));
    }
    if (formData.certifications.length > 0) {
      data.append("certifications", JSON.stringify(formData.certifications));
    }
    data.append("availability", JSON.stringify(formData.availability));
    data.append("preferredSessionMode", JSON.stringify(formData.preferredSessionMode));
    data.append("pricing", JSON.stringify({
      perSession: formData.pricing.perSession ? Number(formData.pricing.perSession) : undefined,
      subscription: formData.pricing.subscription ? Number(formData.pricing.subscription) : undefined,
      customPricing: formData.pricing.customPricing || undefined,
    }));
    data.append("paymentMethod", formData.paymentMethod);
    data.append("bankDetails", JSON.stringify(formData.bankDetails));
    data.append("bio", formData.bio);
    data.append("languages", JSON.stringify(formData.languages));

    for (const key in files) {
      if (files[key]) {
        data.append(key, files[key]);
        console.log(`Appending file ${key}:`, files[key].name);
      }
    }

    console.log("Submitting FormData:");
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    try {
      const response = await fetch(`${backendUrl}/api/counselors/application`, {
        method: "POST",
        headers: { Authorization: authorizationToken },
        body: data,
      });
      const responseData = await response.json();

      if (!response.ok) {
        console.error("Server response:", responseData);
        toast.error(`${responseData.message}: ${responseData.extraDetails || "Unknown error"}`);
        return;
      }

      toast.success("Application submitted successfully! Redirecting to profile...");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Complete Your Counselor Application</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={formData.fullName} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={formData.email} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" value={formData.phoneNumber} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <input type="text" value={formData.gender} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                <input type="text" value={formData.highestQualification} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Specializations</label>
                <input type="text" value={formData.specialization.join(", ")} readOnly className="mt-1 w-full p-3 border rounded-md bg-gray-100" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code (6 digits)</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="\d{6}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Licensed?</label>
                <input
                  type="checkbox"
                  checked={formData.isLicensed}
                  onChange={(e) => setFormData({ ...formData, isLicensed: e.target.checked })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              {formData.isLicensed && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Number</label>
                    <input
                      type="text"
                      value={formData.licenseDetails.number}
                      onChange={(e) => setFormData({ ...formData, licenseDetails: { ...formData.licenseDetails, number: e.target.value } })}
                      className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issuing Authority</label>
                    <input
                      type="text"
                      value={formData.licenseDetails.issuingAuthority}
                      onChange={(e) => setFormData({ ...formData, licenseDetails: { ...formData.licenseDetails, issuingAuthority: e.target.value } })}
                      className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Availability</label>
              <div className="mt-2 flex flex-wrap gap-4">
                {["weekdays", "weekends", "morning", "afternoon", "evening"].map((time) => (
                  <label key={time} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.availability[time]}
                      onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, [time]: e.target.checked } })}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Session Modes (e.g., Video Call, Chat, Audio Call)</label>
                <input
                  type="text"
                  value={formData.preferredSessionMode.join(", ")}
                  onChange={(e) => setFormData({ ...formData, preferredSessionMode: e.target.value.split(",").map(s => s.trim()) })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Video Call, Chat, Audio Call"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Per Session Price</label>
                <input
                  type="number"
                  value={formData.pricing.perSession}
                  onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, perSession: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription Price</label>
                <input
                  type="number"
                  value={formData.pricing.subscription}
                  onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, subscription: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Pricing</label>
                <input
                  type="text"
                  value={formData.pricing.customPricing}
                  onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, customPricing: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankDetails.bankName}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bankName: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  value={formData.bankDetails.ifscCode}
                  onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, ifscCode: e.target.value } })}
                  className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio (min 10 characters)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength="10"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Languages (comma separated)</label>
              <input
                type="text"
                value={formData.languages.join(", ")}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(",").map(s => s.trim()) })}
                className="mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
              <div className="mt-2 space-y-3">
                {["resume", "degreeCertificate", "licenseCertification", "governmentId", "profilePicture"].map((field) => (
                  <div key={field}>
                    <label className="text-gray-600">{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                    <input
                      type="file"
                      name={field}
                      onChange={handleFileChange}
                      className="mt-1 w-full text-gray-700 border p-2 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;