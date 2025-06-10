"use client";
import React from "react";
import { useState } from "react";
import { Pencil } from "lucide-react";
import EditEventModal from "./EventEditModal";

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

  // Remove time portion for clean comparison
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  if (start.getTime() === today.getTime()) {
    return "Active";
  } else if (start.getTime() < today.getTime()) {
    return "Active";
  } else {
    return "Upcoming";
  }
};

const ClubEventCard = ({ event }) => {
  const eventStatus = calculateStatus(event.start_date);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold mb-2">{event.name}</h2>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
              eventStatus
            )}`}
          >
            {eventStatus}
          </span>
        </div>
        <div className="mt-1 mb-3">
          <span className="text-sm font-medium text-gray-700">
            {event.type}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold">When:</span>{" "}
            {new Date(event.start_date).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Description:</span>{" "}
            {event.description}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 flex items-center text-sm text-white bg-dark-green px-2 py-1 rounded cursor-pointer"
        >
          <Pencil className="w-4 h-4 mr-1" /> Edit Event
        </button>
      </div>

      {isModalOpen && (
        <EditEventModal event={event} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ClubEventCard;
