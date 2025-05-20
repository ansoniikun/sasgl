"use client";

import { useState } from "react";
import Link from "next/link";

const Register = () => {
  const [form, setForm] = useState({
    clubName: "",
    clubEmail: "",
    clubPhone: "",
    isPrivateClub: false,
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

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Add your registration logic here
    console.log("Registering:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-32 pb-14">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-dark-gold mb-6">
          Club Registration
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
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

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                name="isPrivateClub"
                id="isPrivateClub"
                className="mr-2"
                checked={form.isPrivateClub}
                onChange={handleChange}
              />
              <label htmlFor="isPrivateClub" className="text-lg font-semibold">
                Private Club
              </label>
            </div>

            {form.isPrivateClub && (
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
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="clubDescription"
                    placeholder="Enter club description..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold h-24"
                    value={form.clubDescription}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

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
            Save
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-dark-gold font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
