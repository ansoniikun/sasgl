// components/Clubs.jsx
const Clubs = ({ clubs, clubStats }) => {
  const getClubStats = (clubId) => {
    const stats = clubStats.filter((stat) => stat.club_id === clubId);
    if (stats.length === 0) return {};

    const totalEvents = stats.length;
    const score = stats.reduce((sum, s) => sum + (s.points || 0), 0);
    const avgPosition =
      stats.reduce((sum, s) => sum + (s.position || 0), 0) / totalEvents;

    return {
      total_events: totalEvents,
      score,
      rank: Math.round(avgPosition),
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 text-dark-gold border-b border-gray-300 pb-2">
        Clubs
      </h2>
      <ul className="max-h-[36rem] overflow-auto space-y-6 pr-2">
        {clubs.map((club) => {
          const stats = getClubStats(club.id);
          return (
            <li
              key={club.id}
              className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-3">
                {club.logo_url && (
                  <img
                    src={club.logo_url}
                    alt={`${club.name} logo`}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {club.name}
                  </h3>
                  <p className="text-sm text-gray-500">{club.email}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{club.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {club.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Private:</span>{" "}
                  {club.is_private ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-medium">Approved:</span>{" "}
                  {club.approved_by_admin ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(club.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Captain Info:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {club.captain_first_name} {club.captain_last_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {club.captain_email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span>{" "}
                    {club.captain_contact || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Club Stats:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="font-medium">Total Events:</span>{" "}
                    {stats.total_events ?? "0"}
                  </p>
                  <p>
                    <span className="font-medium">Score:</span>{" "}
                    {stats.score ?? "0"}
                  </p>
                  <p>
                    <span className="font-medium">Average Rank:</span>{" "}
                    {stats.rank ?? "N/A"}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Clubs;
