"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../lib/config";

const ClubRegister = () => {
  const [token, setToken] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const [form, setForm] = useState({
    clubName: "",
    clubEmail: "",
    clubPhone: "",
    isPrivateClub: false, // renamed from is_public
    clubLogo: null,
    clubDescription: "",
    captainFirstName: "",
    captainLastName: "",
    captainEmail: "",
    captainContactNo: "",
    password: "",
    confirmPassword: "",
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

    const formData = new FormData();
    formData.append("clubName", form.clubName);
    formData.append("clubEmail", form.clubEmail);
    formData.append("clubPhone", form.clubPhone);
    formData.append("isPrivateClub", form.isPrivateClub);
    if (form.clubLogo) formData.append("clubLogo", form.clubLogo);
    formData.append("clubDescription", form.clubDescription);
    formData.append("captainFirstName", form.captainFirstName);
    formData.append("captainLastName", form.captainLastName);
    formData.append("captainEmail", form.captainEmail);
    formData.append("captainContactNo", form.captainContactNo);
    formData.append("password", form.password);

    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessful(true);
      } else {
        setSuccessful(false);
        alert(result.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
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
              Registration sent successfully for Admin approval
            </h2>
            <p className="text-gray-700">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-32 pb-14">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-dark-gold mb-6">
              Club Registration
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Club Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Club Information</h3>
                <input
                  type="text"
                  name="clubName"
                  placeholder="Club Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.clubName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="clubEmail"
                  placeholder="Club Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.clubEmail}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="clubPhone"
                  placeholder="Club Phone Number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.clubPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Private club options */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="isPrivateClub" // renamed
                    id="isPrivateClub"
                    className="mr-2"
                    checked={form.isPrivateClub}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="isPrivateClub"
                    className="text-lg font-semibold"
                  >
                    Private Club
                  </label>
                </div>

                <>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">Club Logo</label>
                    <input
                      type="file"
                      name="clubLogo"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="clubDescription"
                      placeholder="Enter club description..."
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold h-24"
                      value={form.clubDescription}
                      onChange={handleChange}
                    />
                  </div>
                </>
              </div>

              {/* Captain Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Captain's Information
                </h3>
                <input
                  type="text"
                  name="captainFirstName"
                  placeholder="Captain's First Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.captainFirstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="captainLastName"
                  placeholder="Captain's Last Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.captainLastName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="captainEmail"
                  placeholder="Captain's Email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.captainEmail}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="captainContactNo"
                  placeholder="Captain's Contact No."
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.captainContactNo}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold mb-2"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-dark-gold text-black py-2 rounded font-bold hover:bg-yellow-600 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubRegister;
