// src/components/CounselorProfile.jsx
import React from "react";
import { useAuth } from "../Store/auth";
import { FaFileAlt, FaDownload, FaUserCircle, FaSignOutAlt, FaFileUpload } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user, logoutUser, isLoading, authorizationToken } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  // Function to handle document download
  const handleDocumentClick = async (fileId, fileName) => {
    try {
      const response = await fetch(`${backendUrl}/api/counselors/file/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `document-${fileId}`; // Use the filename or a fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Failed to download document: " + error.message);
    }
  };

  // Log user data for debugging
  console.log("User data:", JSON.stringify(user, null, 2));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {user.profilePicture ? (
              <img
                src={`${backendUrl}/api/counselors/file/${user.profilePicture}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
                onError={(e) => (e.target.src = "")} // Fallback if image fails
              />
            ) : (
              <FaUserCircle className="w-32 h-32 text-gray-300" />
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {user.fullName}'s Profile
              <FaUserCircle className="text-blue-500" />
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-800">Email:</span> {user.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Phone:</span> {user.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Gender:</span> {user.gender || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Qualification:</span> {user.highestQualification || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Specializations:</span>{" "}
                {user.specialization?.length > 0 ? user.specialization.join(", ") : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">DOB:</span>{" "}
                {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
              </p>
              <p className="col-span-2">
                <span className="font-semibold text-gray-800">Address:</span>{" "}
                {user.address
                  ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.postalCode}`
                  : "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Experience:</span>{" "}
                {user.yearsOfExperience ? `${user.yearsOfExperience} years` : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Licensed:</span> {user.isLicensed ? "Yes" : "No"}
              </p>
              {user.isLicensed && user.licenseDetails && (
                <p className="col-span-2">
                  <span className="font-semibold text-gray-800">License:</span>{" "}
                  {user.licenseDetails.number
                    ? `${user.licenseDetails.number} (${user.licenseDetails.issuingAuthority || "N/A"})`
                    : "N/A"}
                </p>
              )}
              <p className="col-span-2">
                <span className="font-semibold text-gray-800">Bio:</span> {user.bio || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Languages:</span>{" "}
                {user.languages?.length > 0 ? user.languages.join(", ") : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Availability:</span>{" "}
                {user.availability
                  ? Object.entries(user.availability)
                      .filter(([_, v]) => v)
                      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(", ") || "N/A"
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Session Modes:</span>{" "}
                {user.preferredSessionMode?.length > 0 ? user.preferredSessionMode.join(", ") : "N/A"}
              </p>
              <p className="col-span-2">
                <span className="font-semibold text-gray-800">Pricing:</span>{" "}
                {user.pricing ? (
                  <>
                    {user.pricing.perSession ? `Per Session: ₹${user.pricing.perSession}` : ""}
                    {user.pricing.subscription ? ` Subscription: ₹${user.pricing.subscription}` : ""}
                    {user.pricing.customPricing ? ` ${user.pricing.customPricing}` : ""}
                  </>
                ) : "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Payment Method:</span> {user.paymentMethod || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Bank:</span>{" "}
                {user.bankDetails
                  ? `${user.bankDetails.bankName || "N/A"} - ${user.bankDetails.accountHolderName || "N/A"}`
                  : "N/A"}
              </p>
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center gap-2">
                <FaFileAlt className="text-blue-500" /> Documents
              </h3>
              {user.documents && Object.keys(user.documents).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["resume", "degreeCertificate", "licenseCertification", "governmentId"].map((docType) => {
                    const fileId = user.documents[docType];
                    return fileId ? (
                      <button
                        key={docType}
                        onClick={() => handleDocumentClick(fileId, `${docType.replace(/([A-Z])/g, " $1").trim()}`)}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:shadow-md transition duration-300 text-left w-full"
                      >
                        <FaFileAlt className="text-blue-500 text-xl" />
                        <span className="text-gray-700 font-medium truncate">
                          {docType.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <FaDownload className="text-blue-500 ml-auto" />
                      </button>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <FaFileUpload className="text-gray-400 text-xl" />
                  <p className="text-gray-600 italic">
                    No documents uploaded yet. Complete your application to add them!
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              className="mt-6 flex items-center justify-center gap-2 w-full md:w-auto bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition duration-300 shadow-md"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;