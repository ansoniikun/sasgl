"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebase";
import { API_BASE_URL } from "../lib/config";
import { logout } from "../utils/logout";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("User Dashboard");
  const [data, setData] = useState(null); // holds stats, role, profile pic
  const router = useRouter();

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
      icon: "/dash/create.png ",
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
    { label: "Edit profile", icon: "/dash/edit.png" },
    { label: "Log out", icon: "/dash/logout.png" },
  ];

  const banners = [
    { src: "/banners/test-clubdash5.png", alt: "ITU GOLF WEAR" },
    { src: "/banners/test-clubdash1.png", alt: "BMW Golf Cup" },
    { src: "/banners/test-clubdash2.png", alt: "Swing for a Cause" },
    { src: "/banners/test-clubdash4.png", alt: "Trusted by the Champion" },
    { src: "/banners/test-clubdash3.png", alt: "Better Golf" },
  ];

  // fetch data from backend like the old dashboard
  useEffect(() => {
    const cached = sessionStorage.getItem("dashboardData");
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, userRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats`, { headers }),
          fetch(`${API_BASE_URL}/api/users/me`, { headers }),
        ]);

        const [statsData, userData] = await Promise.all([
          statsRes.json(),
          userRes.json(),
        ]);

        if (!statsRes.ok || !userRes.ok) {
          console.error("Failed to fetch stats or user");
          return;
        }

        let profilePicUrl = null;
        if (userData.profile_picture) {
          profilePicUrl = userData.profile_picture.startsWith("http")
            ? userData.profile_picture
            : await getDownloadURL(
                ref(storage, `profile_pictures/${userData.profile_picture}`)
              );
        }

        const combined = {
          stats: statsData,
          role: userData.role,
          profilePicUrl,
        };

        setData(combined);
        sessionStorage.setItem("dashboardData", JSON.stringify(combined));
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchData();
  }, [router]);

  const canCreateClub = useMemo(
    () => ["chairman", "captain"].includes(data?.role),
    [data]
  );

  if (!data) {
    return (
      <div className="text-center mt-10">
        <p className="mt-36">Loading stats...</p>
      </div>
    );
  }

  const { stats, profilePicUrl } = data;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between">
        <div>
          <div className="p-6">
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
                  } else if (item.label === "Edit profile") {
                    setActiveTab("Edit profile");
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

      {/* Main Content */}
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

        {/* Tabs */}
        <main className="p-6 space-y-6 flex-grow">
          {activeTab === "User Dashboard" && (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-xl p-4">
                  <p className="text-sm text-gray-500">Total Points</p>
                  <p className="text-lg font-semibold text-dark-green">
                    {stats.total_points ?? 0}
                  </p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                  <p className="text-sm text-gray-500">Events Played</p>
                  <p className="text-lg font-semibold text-dark-green">
                    {stats.events_played ?? 0}
                  </p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                  <p className="text-sm text-gray-500">Best Score</p>
                  <p className="text-lg font-semibold text-dark-green">
                    {stats.best_score ?? 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-5 auto-rows-[255px]">
                {banners.map((banner, idx) => {
                  const spanStyles = [
                    "col-span-5 row-span-1",
                    "col-span-3 row-span-1",
                    "col-span-2 row-span-1",
                    "col-span-4 row-span-1",
                    "col-span-2 row-span-1",
                  ];
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden shadow bg-white p-3 ${
                        spanStyles[idx] || "col-span-2 row-span-1"
                      }`}
                    >
                      <img
                        src={banner.src}
                        alt={banner.alt}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  );
                })}
              </div>
            </>
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
