"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

const initialState = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  role: "",
};

function reducer(state, action) {
  return { ...state, [action.field]: action.value };
}

const Register = () => {
  const [form, dispatch] = useReducer(reducer, initialState);
  const [googleUser, setGoogleUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email.trim(),
        password: form.password,
        phone_number: form.phoneNumber,
        role: form.role,
      };

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setRegistered(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setGoogleUser({
        name: user.displayName,
        email: user.email,
        profile_picture: user.photoURL,
      });
      setShowRoleModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRoleSubmit = async () => {
    if (!form.role) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...googleUser,
          role: form.role,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Google registration failed");

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
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
      {/* Left image */}
      <div className="w-5/6 hidden lg:block relative">
        <Image
          src="/register.png"
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

          <h2 className="text-4xl font-semibold text-ash-gray">
            Create Your Account
          </h2>
          <p className="text-lg text-gray-400">
            Sign up to book and track your rounds.
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 gap-2 text-gray-500 font-semibold text-sm hover:bg-gray-50"
            disabled={googleLoading}
          >
            <FcGoogle size={20} />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center text-gray-400 text-sm gap-2">
            <span className="flex-grow border-b"></span>
            <span className="whitespace-nowrap">or Sign up with Email</span>
            <span className="flex-grow border-b"></span>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              {
                label: "Full Name",
                type: "text",
                field: "name",
                placeholder: "John Doe",
              },
              {
                label: "Email",
                type: "email",
                field: "email",
                placeholder: "mail@abc.com",
              },
              {
                label: "Phone Number",
                type: "tel",
                field: "phoneNumber",
                placeholder: "0712345678",
              },
              {
                label: "Password",
                type: "password",
                field: "password",
                placeholder: "Password",
              },
            ].map(({ label, type, field, placeholder }) => {
              if (field === "password") {
                return (
                  <div key={field}>
                    <p className="text-gray-500 mb-0">{label}</p>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
                        className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green pr-10"
                        value={form[field]}
                        onChange={(e) => {
                          // Block input that starts with +
                          const input = e.target.value;
                          if (!input.startsWith("+")) {
                            dispatch({ field, value: input });
                          }
                        }}
                        required
                      />
                      <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 cursor-pointer select-none"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={field}>
                  <p className="text-gray-500 mb-0">{label}</p>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 border placeholder-gray-300 placeholder:text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
                    value={form[field]}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Block input if it starts with '+'
                      if (field === "phoneNumber" && value.startsWith("+")) {
                        setError("Phone number should not start with '+'");
                        return;
                      }
                      if (error && field === "phoneNumber") setError(""); // Clear error
                      dispatch({ field, value });
                    }}
                    required
                  />
                </div>
              );
            })}
            <p className="text-gray-500 mb-0">Select Role</p>
            <select
              value={form.role}
              onChange={(e) =>
                dispatch({ field: "role", value: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green text-gray-600"
            >
              <option value="" disabled className="text-gray-300">
                Select your role
              </option>
              <option value="player">Player</option>
              <option value="captain">Club Captain</option>
              <option value="chairman">Club Chairman</option>
            </select>

            <button
              type="submit"
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign up"}
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

      {/* Role modal for Google */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">
            <h2 className="text-xl font-semibold text-center">
              Choose Your Role
            </h2>
            <select
              value={form.role}
              onChange={(e) =>
                dispatch({ field: "role", value: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-green"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="player">Player</option>
              <option value="captain">Club Captain</option>
              <option value="chairman">Club Chairman</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleGoogleRoleSubmit}
              disabled={!form.role}
              className="w-full bg-dark-green text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
