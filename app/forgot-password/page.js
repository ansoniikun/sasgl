"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "../lib/config";

const ForgotPassword = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="w-5/6 hidden lg:block relative">
        <Image
          src="/login.png"
          alt="Golf Carts"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex" onClick={() => router.push("/")}>
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-4xl font-semibold mb-0 text-ash-gray">
            Reset Your Password
          </h2>
          <p className="text-lg text-gray-400">
            Use your registered phone number to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-500 mb-0">Phone Number</p>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green"
              placeholder="+27 71 234 5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <p className="text-gray-500 mb-0">New Password</p>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <p className="text-gray-500 mb-0">Confirm Password</p>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dark-green"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Reset Password
            </button>
          </form>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <p className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-dark-green font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
