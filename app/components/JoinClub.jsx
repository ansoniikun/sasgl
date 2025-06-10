"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/config";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const JoinClub = () => {
  const [clubs, setClubs] = useState([]);
  const [clubStatuses, setClubStatuses] = useState({});
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      const res = await fetch(`${API_BASE_URL}/api/clubs/all`);
      const data = await res.json();

      const clubsWithLogos = await Promise.all(
        data.map(async (club) => {
          if (club.logo_url) {
            try {
              const logoRef = ref(storage, `club_logos/${club.logo_url}`);
              const logoUrl = await getDownloadURL(logoRef);
              return { ...club, logo_url: logoUrl };
            } catch (err) {
              console.error(`Error fetching logo for ${club.name}:`, err);
              return { ...club, logo_url: null };
            }
          }
          return club;
        })
      );

      setClubs(clubsWithLogos);
    };

    const fetchUserStatuses = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/clubs/user-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const statusMap = {};
      data.forEach((entry) => {
        statusMap[entry.club_id] = entry.status;
      });
      setClubStatuses(statusMap);
    };

    fetchClubs();
    fetchUserStatuses();
  }, []);

  const handleRequest = async (clubId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clubId }),
      });

      const result = await res.json();

      if (res.ok) {
        setClubStatuses((prev) => ({ ...prev, [clubId]: "pending" }));
        setPopup("Join request submitted. Awaiting captain approval.");
      } else {
        setPopup(result.error || "Failed to request to join club.");
      }
    } catch (error) {
      console.error("Request failed:", error);
      setPopup("An error occurred while sending the request.");
    }
  };

  return (
    <div className="relative">
      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm">
            <p className="text-gray-800">{popup}</p>
            <button
              className="mt-4 bg-dark-gold text-white px-4 py-2 rounded hover:bg-yellow-700"
              onClick={() => setPopup(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Join a Club
        </h1>
        <ul className="space-y-6">
          {clubs.map((club) => {
            const status = clubStatuses[club.id];

            return (
              <li
                key={club.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  {club.logo_url && (
                    <img
                      src={club.logo_url}
                      alt={`${club.name} logo`}
                      className="w-16 h-16 object-cover rounded-4xl"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {club.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {club.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRequest(club.id)}
                  disabled={status === "pending" || status === "approved"}
                  className={`text-white px-4 py-2 rounded w-full sm:w-auto ${
                    status === "approved"
                      ? "bg-green-600 cursor-not-allowed"
                      : status === "pending"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-dark-gold hover:bg-yellow-700"
                  }`}
                >
                  {status === "approved"
                    ? "Approved"
                    : status === "pending"
                    ? "Requested"
                    : "Request to Join"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default JoinClub;
