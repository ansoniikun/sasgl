"use client";
import React from "react";

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

const ClubEventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold mb-2">{event.name}</h2>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
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
            <span className="font-semibold">Where:</span>{" "}
            {event.location || "TBA"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Handicap:</span>{" "}
            {event.handicap ? "Required" : "Not required"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Description:</span>{" "}
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClubEventCard;
