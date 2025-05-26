const Users = ({ users, userStats }) => {
  const getUserStats = (userId) => {
    const stats = userStats.filter((stat) => stat.user_id === userId);
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
        Users
      </h2>
      <ul className="max-h-80 overflow-auto divide-y divide-gray-200">
        {users.map((user, i) => {
          const stats = getUserStats(user.id);
          return (
            <li
              key={user.id || i}
              className="py-4 hover:bg-gray-50 px-2 rounded-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg">
                    {user.name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.username} • {user.email}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="mt-3 md:mt-0 text-sm text-gray-700">
                  <p>Total Events: {stats.total_events ?? "0"}</p>
                  <p>Score: {stats.score ?? "0"}</p>
                  <p>Rank: {stats.rank ?? "N/A"}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Users;
