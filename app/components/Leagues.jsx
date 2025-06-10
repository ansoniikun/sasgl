"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnauthorizedPopup, setShowUnauthorizedPopup] = useState(false);

  const leaguesPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/leagues/active-leagues?t=${Date.now()}`
        );
        const data = await res.json();
        setLeagues(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch leagues", error);
        setLeagues([]);
      }
    };

    fetchLeagues();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = async (id, status) => {
    if (status === "upcoming") return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/leagues/${id}/authorized`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        router.push(`/leagues/${id}`);
      } else {
        setShowUnauthorizedPopup(true);
      }
    } catch (err) {
      console.error("Authorization check failed:", err);
      setShowUnauthorizedPopup(true);
    }
  };

  const indexOfLast = currentPage * leaguesPerPage;
  const indexOfFirst = indexOfLast - leaguesPerPage;
  const currentLeagues = leagues.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(leagues.length / leaguesPerPage);

  return (
    <div>
      <div
        className="h-[55vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/hero1.jpg')" }}
      >
        <h1 className="text-4xl md:text-5xl text-white drop-shadow-lg">
          Active Leagues
        </h1>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentLeagues.map((league) => (
            <div
              key={league.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* <img
                src={`${league.logo_url}`}
                alt="Club Logo"
                className="w-full h-48 object-cover"
              /> */}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold mb-2">{league.name}</h2>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                      league.status
                    )}`}
                  >
                    {league.status}
                  </span>
                </div>
                <div className="mt-1 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {league.type}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">When:</span>{" "}
                    {new Date(league.start_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Description:</span>{" "}
                    {league.description}
                  </p>
                </div>
                <button
                  className="mt-4 w-full bg-dark-gold text-white py-2 rounded-md font-medium hover:bg-yellow-600 transition"
                  onClick={() => handleViewDetails(league.id, league.status)}
                >
                  {league.status === "upcoming"
                    ? "Register Now"
                    : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {showUnauthorizedPopup && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-700 mb-6">
              You are not authorized to view this league's details.
            </p>
            <button
              className="px-4 py-2 bg-dark-gold text-white rounded hover:bg-yellow-600 transition"
              onClick={() => setShowUnauthorizedPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leagues;
