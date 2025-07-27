const ConfirmationPage = ({ eventData, packages, onFinalSubmit }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow overflow-hidden">
    <div
      className="w-full h-64 bg-cover bg-center"
      style={{ backgroundImage: `url("/banners/test-clubdash1.png")` }}
    ></div>

    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Event Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <strong className="text-gray-700">Event Title:</strong>{" "}
            {eventData.eventTitle}
          </p>
          <p>
            <strong className="text-gray-700">Description:</strong>{" "}
            {eventData.description}
          </p>
          <p>
            <strong className="text-gray-700">Venue Name:</strong>{" "}
            {eventData.venueName}
          </p>
          <p>
            <strong className="text-gray-700">Organiser:</strong>{" "}
            {eventData.organiserName}
          </p>
          <p>
            <strong className="text-gray-700">Contact Person:</strong>{" "}
            {eventData.contactPerson}
          </p>
        </div>
        <div>
          <p>
            <strong className="text-gray-700">Contact Number:</strong>{" "}
            {eventData.contactNumber}
          </p>
          <p>
            <strong className="text-gray-700">Start Date:</strong>{" "}
            {eventData.startDate}
          </p>
          <p>
            <strong className="text-gray-700">End Date:</strong>{" "}
            {eventData.endDate}
          </p>
          <p>
            <strong className="text-gray-700">Email:</strong> {eventData.email}
          </p>
          <p>
            <strong className="text-gray-700">Number of Packages:</strong>{" "}
            {eventData.packages}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Package Details
      </h3>
      <div className="space-y-4">
        {packages.map((pkg, i) => (
          <div key={i} className="p-4 border border-gray-300 rounded">
            <p>
              <strong className="text-gray-700">Title:</strong> {pkg.title}
            </p>
            <p>
              <strong className="text-gray-700">Type:</strong> {pkg.type}
            </p>
            <p>
              <strong className="text-gray-700">Max Slots:</strong>{" "}
              {pkg.maxSlots}
            </p>
            <p>
              <strong className="text-gray-700">Price:</strong> R{pkg.price}
            </p>
            <p>
              <strong className="text-gray-700">Includes:</strong>{" "}
              {Object.keys(pkg.includes)
                .filter((key) => pkg.includes[key])
                .join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onFinalSubmit}
          className="bg-green-700 text-white font-semibold py-2 px-6 rounded hover:bg-green-800 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmationPage;
