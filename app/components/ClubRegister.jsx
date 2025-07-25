"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../lib/config";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

const ClubRegister = ({ setActiveTab }) => {
  const [token, setToken] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [form, setForm] = useState({
    clubName: "",
    isPrivateClub: false, // renamed from is_public
    clubLogo: null,
    clubDescription: "",
    captainFirstName: "",
    captainLastName: "",
    captainEmail: "",
    captainContactNo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, clubLogo: e.target.files[0] });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let logoUrl = "";

    try {
      if (form.clubLogo) {
        const logoFileName = `${Date.now()}_${form.clubLogo.name}`;
        const logoRef = ref(storage, `club_logos/${logoFileName}`);
        await uploadBytes(logoRef, form.clubLogo);
        logoUrl = logoFileName; // <- store only the name instead of the full URL
      }

      const clubData = {
        clubName: form.clubName,
        clubEmail: form.clubEmail,
        clubPhone: form.clubPhone,
        isPrivateClub: form.isPrivateClub,
        clubLogoUrl: logoUrl,
        clubDescription: form.clubDescription,
        captainFirstName: form.captainFirstName,
        captainLastName: form.captainLastName,
        captainEmail: form.captainEmail,
        captainContactNo: form.captainContactNo,
      };

      const res = await fetch(`${API_BASE_URL}/api/clubs/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clubData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessful(true);
      } else {
        setPopupMessage(result.message || "Registration failed.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("Something went wrong. Please try again later.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  useEffect(() => {
    if (successful) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000); // 3 second delay
      return () => clearTimeout(timer);
    }
  }, [successful, router]);

  return (
    <>
      {successful ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-dark-gold mb-4">
              Registration sent successfully
            </h2>
            <p className="text-gray-700">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top-right cancel button */}
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("My Dashboard")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Create a Club
            </h2>

            {/* Logo Upload */}
            <div className="flex flex-col items-start space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Club Logo
              </label>
              <div className="relative group w-60 h-48 border border-gray-300 rounded-lg overflow-hidden">
                {form.clubLogo ? (
                  <>
                    <img
                      src={URL.createObjectURL(form.clubLogo)}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("logoInput").click()
                        }
                        className="px-3 py-1 text-white bg-blue-400 text-sm font-medium rounded-xl shadow cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Logo Selected
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("logoInput").click()
                        }
                        className="px-3 py-1 text-white bg-blue-400 text-sm font-medium rounded-xl shadow cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>
                  </>
                )}
              </div>
              <input
                type="file"
                id="logoInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Club Name */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Club Name
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={form.clubName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                  required
                />
              </div>

              {/* Club Type */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Private Club
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isPrivateClub"
                    checked={form.isPrivateClub}
                    onChange={handleChange}
                    className="w-4 h-4 text-dark-gold focus:ring-dark-gold"
                  />
                  <span className="text-sm text-gray-500">Yes</span>
                </div>
              </div>

              {/* Club Description (full width) */}
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="clubDescription"
                  value={form.clubDescription}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 w-full h-28"
                />
              </div>

              {/* Captain Details */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Captain First Name
                </label>
                <input
                  type="text"
                  name="captainFirstName"
                  value={form.captainFirstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Captain Last Name
                </label>
                <input
                  type="text"
                  name="captainLastName"
                  value={form.captainLastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Captain Email
                </label>
                <input
                  type="email"
                  name="captainEmail"
                  value={form.captainEmail}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Captain Contact No.
                </label>
                <input
                  type="tel"
                  name="captainContactNo"
                  value={form.captainContactNo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleRegister}
                className="px-4 py-2 bg-dark-green text-white rounded-lg transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Cannot Create Club
            </h2>
            <p className="text-gray-700 mb-4">
              You already have an existing club.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-dark-gold text-black font-semibold rounded hover:bg-yellow-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubRegister;
