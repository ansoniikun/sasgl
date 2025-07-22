"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";
import { API_BASE_URL } from "../lib/config";
import { logout } from "../utils/logout";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("User Dashboard");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState(null);
  const fileInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // check sessionStorage cache
    const cachedUser = sessionStorage.getItem("userData");
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      setProfileData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone_number: parsed.phone_number || "",
        password: "",
      });
      setRole(parsed.role || null);

      if (parsed.profile_picture_url) {
        setProfilePicUrl(parsed.profile_picture_url);
      }
      // no need to fetch if cached
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }
        const userData = await res.json();

        // get profile picture URL
        let url = null;
        if (userData.profile_picture) {
          url = userData.profile_picture.startsWith("http")
            ? userData.profile_picture
            : await getDownloadURL(
                ref(storage, `profile_pictures/${userData.profile_picture}`)
              );
        }
        setProfilePicUrl(url);

        // set profile form data
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          password: "",
        });

        setRole(userData.role || null);

        // cache the data
        sessionStorage.setItem(
          "userData",
          JSON.stringify({
            name: userData.name,
            email: userData.email,
            phone_number: userData.phone_number,
            role: userData.role,
            profile_picture_url: url,
          })
        );
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    fetchUser();
  }, [router]);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }

  function handleProfileFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setProfileFile(e.target.files[0]);
    }
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in");
      return;
    }

    try {
      let profile_picture = null;

      if (profileFile) {
        const fileName = `${Date.now()}_${profileFile.name}`;
        const storageRef = ref(storage, `profile_pictures/${fileName}`);
        await uploadBytes(storageRef, profileFile);
        profile_picture = fileName;
      }

      const bodyData = {
        name: profileData.name,
        email: profileData.email,
        phone_number: profileData.phone_number,
      };

      if (profileData.password.trim() !== "") {
        bodyData.password = profileData.password;
      }
      if (profile_picture) {
        bodyData.profile_picture = profile_picture;
      }

      const res = await fetch(`${API_BASE_URL}/api/dashboard/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage(err.message || "Something went wrong");
    }
  }

  const menuItems = [
    {
      label: "User Dashboard",
      icon: "/dash/dashboard.png",
      icon_select: "/dash/dashboard-select.png",
    },
    {
      label: "Join a club",
      icon: "/dash/join.png",
      icon_select: "/dash/join-select.png",
    },
    {
      label: "Create a club",
      icon: "/dash/create.png",
      icon_select: "/dash/create-select.png",
    },
    {
      label: "Host an event",
      icon: "/dash/host.png",
      icon_select: "/dash/host-select.png",
    },
    {
      label: "Hosted events",
      icon: "/dash/events.png",
      icon_select: "/dash/events-select.png",
    },
    {
      label: "Billing",
      icon: "/dash/billing.png",
      icon_select: "/dash/billing-select.png",
    },
  ];

  const accountItems = [
    { label: "Edit Profile", icon: "/dash/edit.png" },
    { label: "Log out", icon: "/dash/logout.png" },
  ];

  const banners = [
    { src: "/banners/test-clubdash5.png", alt: "ITU GOLF WEAR" },
    { src: "/banners/test-clubdash6.png", alt: "Wine" },
    { src: "/banners/test-clubdash2.png", alt: "Swing for a Cause" },
    { src: "/banners/test-clubdash4.png", alt: "Trusted by the Champion" },
    { src: "/banners/test-clubdash3.png", alt: "Better Golf" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between">
        <div>
          <div className="p-6 cursor-pointer" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="Logo" className="w-40 rounded-xl" />
          </div>
          <div className="mt-4 px-4 text-xs font-semibold text-gray-500">
            MENU
          </div>
          <nav className="space-y-1 px-4">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-2 font-medium py-2 rounded text-left w-full text-sm cursor-pointer ${
                  activeTab === item.label ? "px-4" : "text-gray-400 hover:px-3"
                }`}
              >
                <img
                  src={activeTab === item.label ? item.icon_select : item.icon}
                  alt={item.label + " icon"}
                  className={`w-8 h-8 p-2 border rounded-lg ${
                    activeTab === item.label
                      ? "border-dark-green bg-dark-green"
                      : "border-brown-gray bg-brown-gray"
                  }`}
                />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-4 px-4 text-xs font-medium text-gray-500">
            ACCOUNT PAGES
          </div>
          <nav className="space-y-1 px-4 mt-1">
            {accountItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center text-gray-400 gap-2 font-medium py-2 text-left w-full text-sm cursor-pointer rounded"
                onClick={() => {
                  if (item.label === "Log out") {
                    logout();
                  } else if (item.label === "Edit Profile") {
                    setActiveTab("Edit Profile");
                  }
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label + " icon"}
                  className="w-8 h-8 p-2 border border-brown-gray bg-brown-gray rounded-lg"
                />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <button
            className="cursor-pointer w-full bg-dark-green text-white py-4 text-sm rounded-xl"
            onClick={() => router.push("/clubdashboard")}
          >
            Club Dashboard
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen pt-5 px-5">
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex flex-col">
            <div className="flex space-x-1 items-center">
              <div className="relative w-3 h-3">
                <Image
                  src="/dashnav.png"
                  fill
                  alt="dash nav logo"
                  className="object-cover"
                />
              </div>
              <h1 className="text-sm">/ Dashboard</h1>
            </div>
            <span className="text-ash-gray mt-1 font-medium">{activeTab}</span>
          </div>
          <div className="flex gap-4 items-center">
            {profilePicUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={profilePicUrl}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                No Logo
              </div>
            )}
          </div>
        </header>

        <main className="p-6 space-y-6 flex-grow">
          {activeTab === "User Dashboard" && (
            <div className="grid grid-cols-8 gap-5 auto-rows-[255px]">
              {banners.map((banner, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl overflow-hidden shadow bg-white p-3 ${
                    [
                      "col-span-5",
                      "col-span-3",
                      "col-span-2",
                      "col-span-4",
                      "col-span-2",
                    ][idx]
                  }`}
                >
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Edit Profile" && (
            <div className="space-y-4">
              {/* Top-right cancel button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab("User Dashboard")}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>

              {/* Main edit profile card */}
              <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  Edit Profile
                </h2>

                {/* Profile Picture at top with overlay edit */}
                <div className="flex flex-col items-start space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Profile Picture
                  </label>
                  <div className="relative group w-60 h-50 border border-gray-300 rounded-lg overflow-hidden">
                    {profilePicUrl ? (
                      <>
                        <Image
                          src={profilePicUrl}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1 text-white bg-blue-400 text-sm font-medium rounded-xl shadow cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-60 h-50 border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No Profile Picture
                      </div>
                    )}
                  </div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setProfileFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Inputs underneath */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Name */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={profileData.password}
                      onChange={handleProfileChange}
                      className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleProfileSubmit}
                    className="px-4 py-2 bg-dark-green text-white rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <footer className="text-xs text-gray-500 py-4 bg-gray-50">
          <div className="flex justify-between items-center px-6 mx-auto">
            <span>© 2025 Social Golf League</span>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">
                About Us
              </a>
              <a href="#" className="hover:underline">
                Terms of Use
              </a>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
