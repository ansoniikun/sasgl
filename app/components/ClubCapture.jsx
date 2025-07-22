"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../lib/config";

const ClubCapture = ({ clubId }) => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

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
      const leaderboardRes = await fetch(
        `${API_BASE_URL}/api/clubs/league/${clubId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <div className=" mt-6 bg-white shadow-md rounded-xl p-8 pb-10 ">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Score Card</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        onSubmit={handleSubmit}
      >
        {/* Event */}
        <div className="flex flex-col">
          <label htmlFor="event" className="font-medium text-gray-700">
            Club Event<span className="text-red-500">*</span>
          </label>
          <select
            name="event"
            required
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-dark-green placeholder:text-sm"
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
            className="border border-gray-300 rounded px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-dark-green placeholder:text-sm"
          >
            <option value="">Select a player</option>
            {participants
              .slice() // create a copy so we don't mutate state
              .sort((a, b) => a.name.localeCompare(b.name)) // sort by name
              .map((p) => (
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
            className="border border-gray-300 rounded px-4 py-2 mt-2 placeholder:text-sm"
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
            className="border border-gray-300 rounded px-4 py-2 mt-2 placeholder:text-sm"
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
            className="border border-gray-300 rounded px-4 py-2 mt-2 placeholder:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-full flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => setSelectedEventId("")}
            className="bg-red-500 text-white font-medium px-6 py-2 rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-green-800 text-white font-medium px-6 py-2 rounded-md"
          >
            Submit Scores
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubCapture;
