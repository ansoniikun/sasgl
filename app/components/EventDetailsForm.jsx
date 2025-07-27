"use client";
import { useState } from "react";

export default function EventDetailsForm({ onSubmit }) {
  const [form, setForm] = useState({
    eventTitle: "",
    description: "",
    venueName: "",
    organiserName: "",
    contactPerson: "",
    contactNumber: "",
    startDate: "",
    endDate: "",
    email: "",
    poster: "",
    packages: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="mx-auto bg-white rounded-xl shadow p-8 mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        Event Details
      </h2>

      {/* Upload Poster Block */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Upload Poster *
        </label>
        <div className="w-full sm:w-64 aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
          <input
            type="text"
            name="poster"
            value={form.poster}
            onChange={handleChange}
            placeholder="e.g. URL or file name"
            className="text-center text-sm text-gray-600 bg-transparent outline-none w-full px-2"
            required
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Row 1 */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            name="eventTitle"
            value={form.eventTitle}
            onChange={handleChange}
            placeholder="e.g. Baroka Cares Golf Day"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Event overview, charity goals, etc."
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Venue Name *
          </label>
          <input
            type="text"
            name="venueName"
            value={form.venueName}
            onChange={handleChange}
            placeholder="e.g. Magalies Golf Park"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Organiser Name *
          </label>
          <input
            type="text"
            name="organiserName"
            value={form.organiserName}
            onChange={handleChange}
            placeholder="e.g. Baroka Funerals"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            placeholder="e.g. Frans Malebane"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Contact Number *
          </label>
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="e.g. 083 273 9111"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        {/* Row 3 – Start and End Dates side by side */}
        <div className="md:col-span-3 w-full">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-col flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 w-full"
                required
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[140px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 w-full"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. Frans@Baroka.co.za"
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          />
        </div>

        {/* Row 4 */}
        <div className="flex flex-col max-w-[80px]">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Packages
          </label>
          <select
            name="packages"
            value={form.packages}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end mt-6">
          <button
            type="submit"
            className="bg-green-700 text-white font-semibold py-2 px-6 rounded"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
