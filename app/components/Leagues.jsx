"use client";

const Leagues = () => {
  // Golf league data
  const leagues = [
    {
      id: 1,
      name: "Club Championship",
      type: "Stroke Play",
      participants: 48,
      startDate: "2024-09-15",
      endDate: "2025-09-17",
      location: "Pine Valley Golf Club",
      status: "Ongoing",
      handicapRequired: true,
    },
    {
      id: 2,
      name: "Summer Match Play League",
      type: "Match Play",
      participants: 32,
      startDate: "2024-06-01",
      endDate: "2025-08-31",
      location: "Oakmont Country Club",
      status: "Ongoing",
      handicapRequired: true,
    },
    {
      id: 3,
      name: "Winter Scramble Series",
      type: "Scramble",
      participants: 20,
      startDate: "2025-12-01",
      endDate: "2026-02-28",
      location: "Desert Palm Golf Resort",
      status: "Upcoming",
      handicapRequired: false,
    },
    {
      id: 4,
      name: "Senior Invitational",
      type: "Stableford",
      participants: 60,
      startDate: "2025-05-01",
      endDate: "2026-05-03",
      location: "Golden Age Golf Links",
      status: "Ongoing",
      handicapRequired: true,
    },
    {
      id: 5,
      name: "Twilight 9-Hole League",
      type: "Medal Play",
      participants: 40,
      startDate: "2025-04-15",
      endDate: "2025-10-15",
      location: "Sunset Hills Golf Course",
      status: "Ongoing",
      handicapRequired: false,
    },
    {
      id: 6,
      name: "Club Ryder Cup",
      type: "Team Match Play",
      participants: 24,
      startDate: "2025-09-20",
      endDate: "2026-09-22",
      location: "Eagle's Nest Golf Club",
      status: "Upcoming",
      handicapRequired: true,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatGolfType = (type) => {
    switch (type) {
      case "Stroke Play":
        return "Stroke Play";
      case "Match Play":
        return " Match Play";
      case "Scramble":
        return "Scramble";
      case "Stableford":
        return " Stableford";
      case "Team Match Play":
        return "Team Match Play";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-36">
      <h1 className="text-3xl font-bold text-center mb-8 text-dark-gold">
        Active Leagues
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <div
            key={league.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-2">{league.name}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                    league.status
                  )}`}
                >
                  {league.status}
                </span>
              </div>

              <div className="mt-1 mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {formatGolfType(league.type)}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">When:</span>{" "}
                  {new Date(league.startDate).toLocaleDateString()} -{" "}
                  {new Date(league.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Where:</span>{" "}
                  {league.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Players:</span>{" "}
                  {league.participants}
                </p>

                <p className="text-gray-600">
                  <span className="font-semibold">Handicap:</span>{" "}
                  {league.handicapRequired ? "Required" : "Not required"}
                </p>
              </div>

              <button className="mt-4 w-full bg-dark-gold text-white py-2 rounded-md font-medium hover:bg-yellow-600 transition">
                {league.status === "Upcoming" ? "Register Now" : "View Details"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;
