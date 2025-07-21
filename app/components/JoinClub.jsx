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
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [clubsRes, statusesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/clubs/all`),
          fetch(`${API_BASE_URL}/api/clubs/user-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!clubsRes.ok) {
          console.error("Failed to fetch clubs:", await clubsRes.text());
          return;
        }

        if (!statusesRes.ok) {
          console.error("Failed to fetch statuses:", await statusesRes.text());
          return;
        }

        const clubsData = await clubsRes.json();
        const rawStatuses = await statusesRes.json();

        // Make sure rawStatuses is an array
        const statusesArray = Array.isArray(rawStatuses)
          ? rawStatuses
          : rawStatuses?.data || [];

        // cache logos
        const clubsWithLogos = await Promise.all(
          clubsData.map(async (club) => {
            if (club.logo_url) {
              const cacheKey = `club_logo_${club.id}`;
              const cachedUrl = localStorage.getItem(cacheKey);

              if (cachedUrl) return { ...club, logo_url: cachedUrl };

              try {
                const logoRef = ref(storage, `club_logos/${club.logo_url}`);
                const logoUrl = await getDownloadURL(logoRef);
                localStorage.setItem(cacheKey, logoUrl);
                return { ...club, logo_url: logoUrl };
              } catch (err) {
                console.error(`Logo fetch error for ${club.name}:`, err);
              }
            }
            return { ...club, logo_url: null };
          })
        );

        const statusMap = {};
        statusesArray.forEach((entry) => {
          statusMap[entry.club_id] = entry.status;
        });

        setClubs(clubsWithLogos);
        setClubStatuses(statusMap);
      } catch (err) {
        console.error("Unexpected fetchData error:", err);
      }
    };

    fetchData();
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
            const status = clubStatuses[club.id] || "none";
            const isDisabled = ["pending", "approved"].includes(status);
            const buttonLabel =
              status === "approved"
                ? "Approved"
                : status === "pending"
                ? "Requested"
                : "Request to Join";

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
                      loading="lazy"
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
                  disabled={isDisabled}
                  className={`text-white px-4 py-2 rounded w-full sm:w-auto ${
                    status === "approved"
                      ? "bg-green-600 cursor-not-allowed"
                      : status === "pending"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-dark-gold hover:bg-yellow-700"
                  }`}
                >
                  {buttonLabel}
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
