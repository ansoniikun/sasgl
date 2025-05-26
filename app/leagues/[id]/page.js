"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { API_BASE_URL } from "@/app/lib/config";

const LeagueDetails = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [league, setLeague] = useState(null);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leagues/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch league data");
        }
        const data = await res.json();
        setLeague(data.league);

        if (data.leaderboard) {
          const sortedLeaderboard = [...data.leaderboard].sort(
            (a, b) => b.points - a.points
          );

          const updatedLeaderboard = sortedLeaderboard.map((player, index) => ({
            ...player,
            position: index + 1,
            avg_points: Number(player.avg_points) || 0,
          }));

          setLeaderboard(updatedLeaderboard);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error("Error loading league data:", error);
      }
    };

    fetchLeague();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16 pt-36">
        <h1 className="text-3xl font-bold mb-6 text-dark-gold">
          {league?.name} Leaderboard
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Golfer</th>
                <th className="px-4 py-2 text-left">Games Played</th>
                <th className="px-4 py-2 text-left">Points</th>
                <th className="px-4 py-2 text-left">Avg Points</th>
                <th className="px-4 py-2 text-left">Birdies</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <tr key={player.user_id} className="border-b">
                  <td className="px-4 py-2">{player.position}</td>
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{player.games_played}</td>
                  <td className="px-4 py-2">{player.points}</td>
                  <td className="px-4 py-2">{player.avg_points.toFixed(2)}</td>
                  <td className="px-4 py-2">{player.birdies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LeagueDetails;
