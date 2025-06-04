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

      <main className="flex-1 pt-36">
        <h1 className="text-3xl font-bold mb-6 text-center text-dark-gold">
          {league?.name} Leaderboard
        </h1>

        <div className="max-w-7xl mx-auto mb-[2vh] flex-1 bg-white rounded-xl shadow-md mt-4">
          <table className="w-full text-sm table-auto mt-2">
            <thead className="text-left border-b border-b-gray-200 font-normal text-ash-gray">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Player Name</th>
                <th className="p-3">Games Played</th>
                <th className="p-3">Points</th>
                <th className="p-3">Birdies</th>
                <th className="p-3">Avg Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <tr
                  key={player.user_id}
                  className="text-ash-gray hover:bg-gray-50"
                >
                  <td className="p-3">{player.position}</td>
                  <td className="p-3 capitalize">{player.name}</td>
                  <td className="p-3">{player.games_played}</td>
                  <td className="p-3">{player.points}</td>
                  <td className="p-3">{player.birdies}</td>
                  <td className="p-3">{player.avg_points.toFixed(2)}</td>
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
