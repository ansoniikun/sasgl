"use client";
import { useState } from "react";
import { API_BASE_URL } from "../lib/config";

const ConfirmationPage = ({ eventData, packages, onFinalSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token"); // assuming auth token is stored here

      const response = await fetch(
        `${API_BASE_URL}/api/dashboard/golf-days/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...eventData,
            packages,
          }),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      console.log("Submission Success:", result);
      onFinalSubmit(); // or redirect / show success message
    } catch (err) {
      alert("Error submitting event: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8 bg-white rounded-xl shadow overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Left Poster */}
        <div className="col-span-1">
          <img
            src={eventData.poster || "/banners/test-clubdash1.png"}
            alt="Event Poster"
            className="w-full h-auto rounded"
          />
        </div>

        {/* Right Summary */}
        <div className="col-span-2 grid grid-cols-3 gap-4">
          <div className="col-span-3 mb-2">
            <h2 className="text-xl font-semibold text-black">Event Summary</h2>
          </div>
          <div className="col-span-1 space-y-4">
            <div>
              <label className="block text-sm text-black">Event Title:</label>
              <input
                type="text"
                value={eventData.eventTitle}
                disabled
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-black">Venue:</label>
              <input
                type="text"
                value={eventData.venueName}
                disabled
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-400"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-black">Description</label>
            <textarea
              value={eventData.description}
              disabled
              className="w-full border border-gray-300 px-3 py-2 rounded-md min-h-[104px] text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-10">
        {[
          { label: "Start Date", value: eventData.startDate },
          { label: "End Date", value: eventData.endDate },
          { label: "Organiser", value: eventData.organiserName },
          { label: "Contact Person", value: eventData.contactPerson },
          { label: "Contact Number", value: eventData.contactNumber },
          { label: "Email", value: eventData.email },
          { label: "Packages", value: eventData.packages },
        ].map((item, i) => (
          <div key={i}>
            <label className="block text-sm text-black">{item.label}</label>
            <input
              type="text"
              value={item.value}
              disabled
              className="w-full border border-gray-300 px-2 py-1 rounded-md text-gray-400"
            />
          </div>
        ))}
      </div>

      {/* Packages */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-lg p-4 space-y-4 text-sm text-gray-400"
          >
            <h4 className="text-base font-semibold text-black">
              Package {i + 1}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title" value={pkg.title} />
              <Input label="Max Slots" value={pkg.maxSlots} />
              <Input label="Type" value={pkg.type} />
              <Input label="Price" value={`R${pkg.price}`} />
            </div>
            <div>
              <label className="block text-xs text-black">Includes</label>
              <textarea
                disabled
                value={
                  Object.keys(pkg.includes)
                    .filter((key) => pkg.includes[key])
                    .join(", ") || "None"
                }
                className="w-full border border-gray-300 px-2 py-1 rounded-md text-gray-400"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-dark-green text-white font-semibold py-2 px-6 rounded hover:bg-green-800 transition disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, value }) => (
  <div>
    <label className="block text-xs text-black">{label}</label>
    <input
      type="text"
      value={value}
      disabled
      className="w-full border border-gray-300 px-2 py-1 rounded-md text-gray-400"
    />
  </div>
);

export default ConfirmationPage;
