"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        // Fetch stats
        const statsRes = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const statsData = await statsRes.json();
        if (!statsRes.ok) {
          console.error("Error fetching stats:", statsData);
        } else {
          setStats(statsData);
        }

        // Fetch user role
        const roleRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const roleData = await roleRes.json();
        if (!roleRes.ok) {
          console.error("Error fetching user role:", roleData);
        } else {
          setRole(roleData.role);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchData();
  }, [router]);

  if (!stats || !role)
    return (
      <div className="text-center mt-10">
        <DashboardNav />
        <p className="mt-36">Loading stats...</p>
      </div>
    );

  const canCreateClub = ["chairman", "captain"].includes(role);

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl min-h-screen p-6 mx-auto">
        <DashboardNav role={role} />

        <div className="flex justify-between items-center pt-36 mb-6">
          <h1 className="text-3xl font-bold">Welcome, {stats.name}</h1>
          <Link
            href="/edit-profile"
            className="bg-dark-green text-white font-semibold py-2 px-4 rounded shadow transition"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Total Points</h2>
            <p className="text-2xl font-bold text-dark-gold">
              {stats.total_points ?? 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Events Played</h2>
            <p className="text-2xl font-bold text-dark-gold">
              {stats.events_played ?? 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Best Score</h2>
            <p className="text-2xl font-bold text-dark-gold">
              {stats.best_score ?? 0}
            </p>
          </div>
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

export default DashboardPage;
