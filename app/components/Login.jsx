"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          "Sorry, your password was incorrect. Please double-check your password."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now().toString());
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMessage("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("loginTime", Date.now().toString());
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Google login failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="w-5/6 hidden lg:block relative">
        <Image
          src="/login.png"
          alt="Golf Carts"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-4xl font-semibold mb-0 text-ash-gray">
            Welcome Back!
          </h2>
          <p className="text-lg text-gray-400">
            Join your team league and start capturing your scores
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center text-gray-500 font-semibold text-sm border border-gray-300 rounded-md py-2 gap-2 hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FcGoogle size={20} />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Separator */}
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <span className="flex-grow border-b"></span>
            <span className="whitespace-nowrap">or Sign in with Phone</span>
            <span className="flex-grow border-b"></span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <p className="text-gray-500 mb-0">Phone Number</p>
              <input
                type="tel"
                placeholder="071 234 5678"
                value={phoneNumber}
                onChange={(e) => {
                  const input = e.target.value;
                  if (!input.startsWith("+")) {
                    setPhoneNumber(input);
                  }
                }}
                required
                className="w-full px-4 py-2 border placeholder:text-sm placeholder-gray-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border placeholder:text-sm placeholder-gray-300 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green pr-10"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 cursor-pointer select-none"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/*<div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center gap-1">
                <input type="checkbox" className="accent-dark-green" />
                Remember Me
              </label>
              /* <Link href="/forgot-password" className="text-dark-green font-medium">Forgot Password?</Link>
            </div>*/}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Not Registered Yet?{" "}
            <Link href="/register" className="text-dark-green font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
