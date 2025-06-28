"use client";
import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import EditEventModal from "./EventEditModal";
import { API_BASE_URL } from "../lib/config";

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

  if (start.getTime() === today.getTime() || start.getTime() < today.getTime()) {
    return "Active";
  } else {
    return "Upcoming";
  }
};

const ClubEventCard = ({ event }) => {
  const eventStatus = calculateStatus(event.start_date);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
  

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow relative">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold mb-2">
              {event.name.length > 21 ? `${event.name.slice(0, 21)}...` : event.name}
            </h2>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                eventStatus
              )}`}
            >
              {eventStatus}
            </span>
          </div>
          <div className="mt-1 mb-3">
            <span className="text-sm font-medium text-gray-700">{event.type}</span>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">When:</span>{" "}
              {new Date(event.start_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Description:</span> {event.description}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center text-sm uppercase text-white bg-dark-green px-2 py-1 rounded cursor-pointer font-semibold"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center text-sm uppercase text-white bg-ash-gray hover:bg-red-700 px-2 py-1 font-semibold rounded cursor-pointer"
            >
              <Trash className="w-4 h-4 mr-1" /> Delete
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
