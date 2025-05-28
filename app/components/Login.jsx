"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

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
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="w-5/6 hidden lg:block relative">
        <Image
          src="/login.png" // Ensure this image exists in your /public folder
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
          <div className="flex ">
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-4xl font-semibold mb-0 text-pale-green">
            Welcome Back!
          </h2>
          <p className="text-lg text-gray-400">
            Join your team league and start capturing your scores
          </p>

          {/* Google Sign In */}
          <button className="w-full flex text-gray-500 font-semibold text-sm items-center justify-center border border-gray-300  rounded-md py-2 gap-2 hover:bg-gray-50 cursor-pointer">
            <FcGoogle size={20} className="mr-2" />
            <span>Continue with Google</span>
          </button>

          {/* Separator */}
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <span className="flex-grow border-b"></span>
            <span className="whitespace-nowrap">or Sign in with Email</span>
            <span className="flex-grow border-b"></span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-gray-500 mb-0">Email</p>
            <input
              type="email"
              placeholder="mail@abc.com"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-gray-500 mb-0">Password</p>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center gap-1 ">
                <input type="checkbox" className="accent-dark-green" />
                Remember Me
              </label>
              <Link
                href="/forgot-password"
                className="text-dark-green font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {errorMessage && (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          )}

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
