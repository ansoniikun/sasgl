import { useState, useEffect } from "react";
import { API_BASE_URL } from "../lib/config";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    start_date: "",
    end_date: "",
    handicap: false,
    location: "",
    club_id: "",
  });

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [recordForm, setRecordForm] = useState({
    user_id: "",
    score: 0,
    points: 0,
    birdies: 0,
    strokes: 0,
    putts: 0,
    greens_in_reg: 0,
    fairways_hit: 0,
    penalties: 0,
    notes: "",
    submitted_by: "", // Fill programmatically if needed (e.g., current admin username or ID)
  });
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchClubs();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/admin/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events);
    }
  };

  const fetchClubs = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/clubs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setClubs(data);
      console.log(clubs);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      type: "",
      description: "",
      start_date: "",
      end_date: "",
      handicap: false,
      location: "",
      club_id: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setIsEditMode(true);
    setCurrentEventId(event.id);
    setFormData({
      name: event.name,
      type: event.type,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      handicap: event.handicap,
      location: event.location,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = isEditMode
      ? `${API_BASE_URL}/api/admin/events/${currentEventId}`
      : `${API_BASE_URL}/api/admin/events`;

    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newEvent = await res.json();
      if (isEditMode) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === newEvent.id ? newEvent : ev))
        );
      } else {
        setEvents((prev) => [...prev, newEvent]);
      }
      setModalOpen(false);
    }
  };

  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    const res = await fetch(`${API_BASE_URL}/api/admin/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    }
  };

  const openRecordModal = async (event) => {
    setSelectedEvent(event);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_BASE_URL}/api/admin/events/${event.id}/participants`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setParticipants(data.participants);
      setRecordModalOpen(true);
    }
  };

  const submitStats = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Example: Automatically add submitted_by info here, e.g. from auth context or localStorage
    const submittedBy = localStorage.getItem("adminUsername") || "admin";

    const payload = {
      event_id: selectedEvent.id,
      ...recordForm,
      submitted_by: submittedBy,
    };

    const res = await fetch(`${API_BASE_URL}/api/admin/record-stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Stats recorded.");
      setRecordForm({
        user_id: "",
        score: 0,
        points: 0,
        birdies: 0,
        strokes: 0,
        putts: 0,
        greens_in_reg: 0,
        fairways_hit: 0,
        penalties: 0,
        notes: "",
        submitted_by: "",
      });
      setRecordModalOpen(false);
    } else {
      alert("Failed to record stats.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={openCreateModal}
        className="bg-dark-gold text-black px-4 py-2 rounded"
      >
        Create Event
      </button>

      {/* Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Event" : "Create Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Event Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <select
                className="w-full border p-2 rounded"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="league">League</option>
                <option value="tournament">Tournament</option>
                <option value="annual">Annual</option>
              </select>
              <select
                className="w-full border p-2 rounded"
                value={formData.club_id}
                onChange={(e) =>
                  setFormData({ ...formData, club_id: e.target.value })
                }
                required
              >
                <option value="">Select Club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.handicap}
                  onChange={(e) =>
                    setFormData({ ...formData, handicap: e.target.checked })
                  }
                />
                <span>Handicap Event</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-dark-gold text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <p>{event.description}</p>
            <p>
              <strong>Type:</strong> {event.type}
            </p>
            <p>
              <strong>Dates:</strong> {event.start_date} → {event.end_date}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Handicap:</strong> {event.handicap ? "Yes" : "No"}
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                onClick={() => openRecordModal(event)}
              >
                Record Games
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => openEditModal(event)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => deleteEvent(event.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record Stats Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              Record Stats - {selectedEvent.name}
            </h2>
            <form onSubmit={submitStats} className="space-y-3">
              <div>
                <label htmlFor="participant" className="block mb-1 font-medium">
                  Participant
                </label>
                <select
                  id="participant"
                  className="w-full border p-2 rounded"
                  value={recordForm.user_id}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, user_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Participant</option>
                  {participants.map((p) => (
                    <option key={p.user_id} value={p.user_id}>
                      {p.username || p.name || p.user_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Numeric fields */}
              {[
                { label: "Score", key: "score" },
                { label: "Points", key: "points" },
                { label: "Birdies", key: "birdies" },
                { label: "Strokes", key: "strokes" },
                { label: "Putts", key: "putts" },
                { label: "Greens in Regulation", key: "greens_in_reg" },
                { label: "Fairways Hit", key: "fairways_hit" },
                { label: "Penalties", key: "penalties" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border p-2 rounded"
                    value={recordForm[key]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setRecordForm({
                        ...recordForm,
                        [key]: isNaN(val) ? 0 : val,
                      });
                    }}
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1 font-medium">Notes</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={recordForm.notes}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, notes: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-dark-gold text-white px-4 py-2 rounded"
                >
                  Submit Stats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
