"use client";
import React, { useState } from "react";
import { Pencil, Trash, ArrowRight } from "lucide-react";
import EditEventModal from "./EventEditModal";
import { API_BASE_URL } from "../lib/config";
import { useRouter } from "next/navigation";

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

const calculateStatus = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  if (
    start.getTime() === today.getTime() ||
    start.getTime() < today.getTime()
  ) {
    return "Active";
  } else {
    return "Upcoming";
  }
};

const ClubEventCard = ({ event, clubId, currentUserRole }) => {
  const eventStatus = calculateStatus(event.start_date);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/events/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust as needed
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Delete failed");
      }

      alert("Event deleted successfully.");
      setShowDeleteConfirm(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
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

  return (
    <>
      <div className="bg-white rounded-2xl border border-white hover:shadow-lg transition-shadow relative cursor-pointer">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-medium mb-2n text-gray-800">
              {event.name.length > 21
                ? `${event.name.slice(0, 19)}...`
                : event.name}
            </h2>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                eventStatus
              )}`}
            >
              {eventStatus}
            </span>
          </div>
          <div className="mt-1 space-y-2 text-gray-400 text-sm">
            {/* League and Date Row */}
            <div className="flex justify-between items-center ">
              <span>{event.type || "N/A"}</span>
              <span>{new Date(event.start_date).toLocaleDateString()}</span>
            </div>

            {/* Description */}
            <p className="">
              <span className="">Description:</span> {event.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            {(currentUserRole === "captain" ||
              currentUserRole === "chairman") && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-green-600 cursor-pointer"
                  title="Edit Event"
                >
                  <Pencil className="h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 cursor-pointer"
                  title="Delete Event"
                >
                  <Trash className="h-4" />
                </button>
              </div>
            )}

            {/* Arrow on the right */}
            <button
              onClick={() =>
                handleViewDetails(event.id, eventStatus.toLowerCase())
              }
              className="text-blue-400  transition-colors cursor-pointer"
              title="View Details"
            >
              <span className="flex items-center">
                View <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EditEventModal event={event} onClose={() => setIsModalOpen(false)} />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">Delete Event</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{event.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubEventCard;
