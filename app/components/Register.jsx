"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");

  const [registered, setRegistered] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: phoneNumber,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      setRegistered(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      alert(err.message);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl text-dark-green mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="w-5/6 hidden lg:block relative">
        <Image
          src="/register.png"
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
          <div className="flex" onClick={() => router.push("/")}>
            <Image src="/logo.jpg" alt="Logo" width={60} height={60} />
          </div>

          <h2 className="text-4xl font-semibold mb-0 text-ash-gray">
            Create Your Account
          </h2>
          <p className="text-lg text-gray-400">
            Sign up to book and track your rounds.
          </p>

          {/* Google Sign Up */}
          <button className="w-full flex text-gray-500 font-semibold text-sm items-center justify-center border border-gray-300 rounded-md py-2 gap-2 hover:bg-gray-50 cursor-pointer">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          {/* Separator */}
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <span className="flex-grow border-b"></span>
            <span className="whitespace-nowrap">or Sign up with Email</span>
            <span className="flex-grow border-b"></span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-gray-500 mb-0">Full Name</p>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <p className="text-gray-500 mb-0">Email</p>
            <input
              type="email"
              placeholder="mail@abc.com"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <p className="text-gray-500 mb-0">Phone Number</p>
            <input
              type="tel"
              placeholder="+27 71 234 5678"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-gray-500 mb-0">Select Role</p>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green text-gray-600 "
            >
              <option value="" disabled className="text-gray-300">
                Select your role
              </option>
              <option value="player">Player</option>
              <option value="captain">Club Captain</option>
              <option value="chairman">Club Chairman</option>
              <option value="admin">Admin</option>
            </select>

            <p className="text-gray-500 mb-0">Password</p>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-dark-green font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
