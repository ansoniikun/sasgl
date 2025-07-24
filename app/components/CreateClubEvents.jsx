"use client";
import { useState } from "react";
import { API_BASE_URL } from "../lib/config";

const CreateClubEventModal = ({ clubId, onEventCreated, onClose }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("league");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();

      const body = {
        name,
        type,
        start_date: startDate,
        handicap: false,
        description,
      };

      // Only include end_date and location if not a league
      if (type !== "league") {
        body.end_date = endDate;
        body.location = location;
      }

      const res = await fetch(`${API_BASE_URL}/api/clubs/${clubId}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const newEvent = await res.json();

        // Update local cache
        const cached = sessionStorage.getItem("clubDashboardData");
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.clubEvents = [...parsed.clubEvents, newEvent];
          sessionStorage.setItem("clubDashboardData", JSON.stringify(parsed));
        }

        onEventCreated(newEvent);
        onClose();
        window.location.reload();
      } else {
        const errMsg = await res.text();
        console.error("Failed to create event", errMsg);
      }
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90vw] lg:w-full shadow-lg">
        <h2 className="text-xl font-medium mb-4">Create New Club Event</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded border-gray-300"
          />

          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded border-gray-300"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded border-gray-300"
          >
            <option value="league">League</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-2 border rounded border-gray-300"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dark-green text-white rounded disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubEventModal;
