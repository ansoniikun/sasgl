"use client";

const Events = () => {
  // Annual events data
  const annualEvents = [
    {
      id: 1,
      name: "Club Anniversary Tournament",
      date: "2025-10-15",
      location: "Main Club Ground",
      type: "Annual",
    },
    {
      id: 2,
      name: "Summer Gala",
      date: "2025-12-20",
      location: "Club Pavilion",
      type: "Annual",
    },
    {
      id: 3,
      name: "Founder's Day Match",
      date: "2025-03-05",
      location: "Historic Ground",
      type: "Annual",
    },
  ];

  // Upcoming tournaments data
  const upcomingTournaments = [
    {
      id: 4,
      name: "Summer Open Championship",
      date: "2025-07-08",
      registrationDeadline: "2023-06-20",
      teamsRegistered: 12,
      maxTeams: 16,
      type: "Tournament",
    },
    {
      id: 5,
      name: "Junior Development Series",
      date: "2025-08-12",
      registrationDeadline: "2023-07-28",
      teamsRegistered: 8,
      maxTeams: 12,
      type: "Tournament",
    },
    {
      id: 6,
      name: "Community Shield",
      date: "2025-09-03",
      registrationDeadline: "2023-08-20",
      teamsRegistered: 6,
      maxTeams: 8,
      type: "Tournament",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-36">
      <h1 className="text-3xl font-bold text-center mb-8 text-dark-gold">
        Club Events
      </h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-dark-gold border-b pb-2">
          Annual Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annualEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span>{" "}
                {event.location}
              </p>
              <button className="mt-4 bg-dark-gold text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition">
                More Info
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-dark-gold border-b pb-2">
          Upcoming Tournaments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">
                  Tournament
                </th>
                <th className="py-3 px-4 text-left font-semibold">Date</th>
                <th className="py-3 px-4 text-left font-semibold">
                  Registration Deadline
                </th>
                <th className="py-3 px-4 text-left font-semibold">Teams</th>
                <th className="py-3 px-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingTournaments.map((tournament) => (
                <tr key={tournament.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">{tournament.name}</td>
                  <td className="py-4 px-4">
                    {new Date(tournament.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(
                      tournament.registrationDeadline
                    ).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {tournament.teamsRegistered}/{tournament.maxTeams}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-dark-gold h-2.5 rounded-full"
                        style={{
                          width: `${
                            (tournament.teamsRegistered / tournament.maxTeams) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {tournament.teamsRegistered < tournament.maxTeams ? (
                      <button className="bg-dark-gold text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-600 transition">
                        Register
                      </button>
                    ) : (
                      <span className="text-red-500 text-sm font-medium">
                        Full
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Events;
