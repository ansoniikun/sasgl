"use client";
import React, { useState } from "react";
import { API_BASE_URL } from "../lib/config";

const EditEventModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    name: event.name,
    type: event.type,
    description: event.description,
    start_date: event.start_date.slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // or however you're storing it

    if (!token) {
      console.error("No token found");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/clubs/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onClose();
      window.location.reload();
    } else {
      const errorData = await res.json();
      console.error("Failed to update event:", errorData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[90vw] lg:w-full shadow-lg  max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "type"].map((field) => (
            <input
              key={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full border p-2 text-gray-400 rounded border-gray-300"
              required
            />
          ))}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded text-gray-400 border-gray-300"
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="border p-2 rounded w-full text-gray-400 border-gray-300"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-black "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-dark-green text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
