"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching stats:", data);
        } else {
          setStats(data);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchStats();
  }, [router]);

  if (!stats)
    return (
      <div className="text-center mt-10">
        <DashboardNav />
        <p className="mt-36">Loading stats...</p>
      </div>
    );

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl min-h-screen p-6 mx-auto">
        <DashboardNav />
        <h1 className="text-3xl font-bold mb-6 pt-36">Welcome, {stats.name}</h1>

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
              {stats.best_score ?? "N/A"}
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
          <Link
            href="/createclub"
            className="bg-dark-gold text-black font-bold py-2 px-6 rounded shadow hover:bg-yellow-600 transition text-center"
          >
            Create a Club
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
