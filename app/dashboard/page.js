"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebase";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const router = useRouter();

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
        const { profile_picture } = userData;

        if (profile_picture) {
          profilePicUrl = profile_picture.startsWith("http")
            ? profile_picture
            : await getDownloadURL(ref(storage, `profile_pictures/${profile_picture}`));
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

  if (!data)
    return (
      <div className="text-center mt-10">
        <DashboardNav />
        <p className="mt-36">Loading stats...</p>
      </div>
    );

  const { stats, role, profilePicUrl } = data;

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl min-h-screen p-6 mx-auto">
        <DashboardNav role={role} />

        <div className="pt-36 mb-6 flex flex-col items-center text-center">
          {profilePicUrl && (
            <div className="w-48 h-48 relative rounded-full overflow-hidden border-4 border-gray-300 mb-4 shadow">
              <Image
                src={profilePicUrl}
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}
          <h1 className="text-3xl font-bold">Welcome, {stats.name}</h1>
        </div>

        <div className="flex justify-end mb-4">
          <Link
            href="/edit-profile"
            className="bg-dark-green text-white font-semibold py-2 px-4 rounded shadow transition"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Points" value={stats.total_points} />
          <StatCard title="Events Played" value={stats.events_played} />
          <StatCard title="Best Score" value={stats.best_score} />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/joinclub"
            className="bg-white border border-dark-gold text-dark-gold font-bold py-2 px-6 rounded shadow hover:bg-dark-gold hover:text-white transition text-center"
          >
            Join a Club
          </Link>

          {canCreateClub && (
            <Link
              href="/createclub"
              className="bg-dark-gold text-black font-bold py-2 px-6 rounded shadow hover:bg-yellow-600 transition text-center"
            >
              Create a Club
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-2xl font-bold text-dark-gold">{value ?? 0}</p>
  </div>
);

export default DashboardPage;
