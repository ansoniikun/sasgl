"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../lib/config";

const ClubCapture = () => {
  const [clubId, setClubId] = useState(null);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  // Get user's club ID
  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const res = await fetch(`${API_BASE_URL}/api/clubs/myclub`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch club");
        const data = await res.json();
        setClubId(data.id);
      } catch (error) {
        console.error("Failed to fetch club", error);
      }
    };

    fetchClub();
  }, []);

  // Fetch events for the club
  useEffect(() => {
    if (!clubId) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clubs/events/${clubId}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();
  }, [clubId]);

  // Fetch participants for selected event
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchParticipants = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/clubs/event-participants/${selectedEventId}`
        );
        if (!res.ok) throw new Error("Failed to fetch participants");
        const data = await res.json();
        setParticipants(data);
      } catch (error) {
        console.error("Failed to fetch participants", error);
      }
    };

    fetchParticipants();
  }, [selectedEventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const points = Number(formData.get("points") || 0);
    const birdies = Number(formData.get("birdies") || 0);
    const strokes = Number(formData.get("strokes") || 0);

    if (!selectedEventId || !selectedPlayerId) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/submit-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: selectedEventId,
          userId: selectedPlayerId,
          points,
          birdies,
          strokes,
          submittedBy: selectedPlayerId,
          notes: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit stats.");
      }

      alert("Scores submitted successfully!");

      // Refetch updated leaderboard
      const leaderboardRes = await fetch(`${API_BASE_URL}/api/clubs/league/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedLeagueData = await leaderboardRes.json();
      
      // Update cache
      const cached = sessionStorage.getItem("clubDashboardData");
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.leagueData = updatedLeagueData;
        sessionStorage.setItem("clubDashboardData", JSON.stringify(parsed));
      }
      
      // Reset form
      e.target.reset();
      setSelectedEventId("");
      setSelectedPlayerId("");
      
      // Optionally reload if needed, but no stale data now
      window.location.reload();      
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit stats.");
    }
  };

  return (
    <div className="lg:ml-[25vw] lg:mr-[3vw] mt-6 bg-white shadow-md rounded-lg p-5 max-w-5xl">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Capture Score
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
        onSubmit={handleSubmit}
      >
        {/* Event */}
        <div className="flex flex-col">
          <label htmlFor="event" className="font-medium text-gray-700">
            Event<span className="text-red-500">*</span>
          </label>
          <select
            name="event"
            required
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="border border-gray-300 rounded px-4 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-dark-green placeholder:text-sm"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Player Name */}
        <div className="flex flex-col">
          <label htmlFor="player" className="font-medium text-gray-700">
            Player Name<span className="text-red-500">*</span>
          </label>
          <select
            name="player"
            required
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="border border-gray-300 rounded px-4 py-1 mt-0.5 focus:outline-none focus:ring-2 focus:ring-dark-green placeholder:text-sm"
          >
            <option value="">Select a player</option>
            {participants.map((p) => (
              <option key={p.user_id} value={p.user_id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Points */}
        <div className="flex flex-col">
          <label htmlFor="points" className="font-medium text-gray-700">
            Points
          </label>
          <input
            type="number"
            name="points"
            placeholder="0"
            className="border border-gray-300 rounded px-4 py-1 mt-0.5 placeholder:text-sm"
          />
        </div>

        {/* Birdies */}
        <div className="flex flex-col">
          <label htmlFor="birdies" className="font-medium text-gray-700">
            Birdies
          </label>
          <input
            type="number"
            name="birdies"
            placeholder="0"
            className="border border-gray-300 rounded px-4 py-1 mt-0.5 placeholder:text-sm"
          />
        </div>

        {/* Strokes */}
        <div className="flex flex-col">
          <label htmlFor="strokes" className="font-medium text-gray-700">
            Strokes
          </label>
          <input
            type="number"
            name="strokes"
            placeholder="0"
            className="border border-gray-300 rounded px-4 py-1 mt-0.5 placeholder:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-full flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => setSelectedEventId("")}
            className="bg-ash-gray text-white font-semibold px-6 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-dark-green text-white font-semibold px-6 py-2 rounded-md"
          >
            Submit Scores
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubCapture;
