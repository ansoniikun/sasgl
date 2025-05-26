"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // new state for error
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // reset error on each submit

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If login fails, show custom error message instead of alert
        setErrorMessage(
          "Sorry, your password was incorrect. Please double-check your password."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-center text-dark-gold mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-gold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-dark-gold text-black py-2 rounded transition cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Error message and forgot password link */}
        {errorMessage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">{errorMessage}</p>
            <Link
              href="/forgot-password"
              className="text-dark-gold font-semibold text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-dark-gold font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
