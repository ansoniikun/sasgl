"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClubEventCard from "../components/ClubEventCard";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";

const ClubDashboard = () => {
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noClub, setNoClub] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [clubEvents, setClubEvents] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setNoClub(true);
          return;
        }

        // Get current user
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Failed to get user");
        const user = await userRes.json();
        setCurrentUserId(user.id);
        setCurrentUserRole(user.role);

        // Get club data
        const clubRes = await fetch(`${API_BASE_URL}/api/clubs/myclub`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!clubRes.ok) {
          setNoClub(true);
          return;
        }

        const club = await clubRes.json();
        setClubData(club);

        // Get club members
        const membersRes = await fetch(
          `${API_BASE_URL}/api/clubs/${club.id}/members`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData);
        }

        // Get club events
        const eventsRes = await fetch(
          `${API_BASE_URL}/api/events/club/${club.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setClubEvents(eventsData);
        } else {
          console.error("Failed to fetch events for club.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setNoClub(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approveMember = async (memberId) => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    setApprovingIds((prev) => new Set(prev).add(memberId));
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/clubs/${clubData.id}/members/${memberId}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === memberId ? { ...m, status: "approved" } : m
          )
        );
      } else {
        alert("Failed to approve member");
      }
    } catch (err) {
      console.error("Error approving member:", err);
      alert("Error approving member");
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const rejectMember = async (memberId) => {
    const token = getToken();
    if (!token) {
      alert("You must be logged in.");
      return;
    }

    setApprovingIds((prev) => new Set(prev).add(memberId));
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/clubs/${clubData.id}/members/${memberId}/reject`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        alert("Failed to reject member");
      }
    } catch (err) {
      console.error("Error rejecting member:", err);
      alert("Error rejecting member");
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  if (loading)
    return <div className="p-6 text-center">Loading club data...</div>;

  if (noClub)
    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded shadow mt-10 text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black">
          No club association found
        </h2>
        <p className="text-gray-700 mb-6 text-sm sm:text-base">
          Would you like to go back to your dashboard or register a new club?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/createclub")}
            className="px-4 py-2 bg-dark-gold text-white rounded"
          >
            Register New Club
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <DashboardNav />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {clubData.name} Dashboard
        </h1>

        {clubData.logo_url && (
          <img
            src={`${clubData.logo_url}`}
            alt={`${clubData.name} Logo`}
            className="h-28 w-28 sm:h-32 sm:w-32 object-cover rounded shadow mb-4"
          />
        )}

        <div className="space-y-2 text-sm sm:text-base text-gray-700 mb-10">
          <p>
            <span className="font-semibold">Captain:</span>{" "}
            {clubData.captain_name}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {clubData.captain_contact_no}
          </p>
          <p>
            <span className="font-semibold">Private:</span>{" "}
            {clubData.is_private ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {clubData.description}
          </p>
        </div>

        {/* Club Members */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Club Members
          </h2>
          {members.length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <li
                  key={member.id || member.email || index}
                  className="bg-white p-4 rounded shadow flex items-center gap-4"
                >
                  <img
                    src={
                      member.avatar_url
                        ? `${BASE_URL}${member.avatar_url}`
                        : "/carousel1.jpg"
                    }
                    alt={member.name || "Member avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    {member.handicap !== undefined && (
                      <p className="text-sm text-gray-600">
                        Handicap: {member.handicap}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      {member.status === "approved" ? (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          Approved
                        </span>
                      ) : currentUserRole === "captain" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveMember(member.id)}
                            disabled={approvingIds.has(member.id)}
                            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approvingIds.has(member.id)
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => rejectMember(member.id)}
                            disabled={approvingIds.has(member.id)}
                            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approvingIds.has(member.id)
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Club Events */}
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Club Events
          </h2>
          {clubEvents.length === 0 ? (
            <p className="text-gray-500">No events found for this club.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clubEvents.map((event) => (
                <ClubEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
