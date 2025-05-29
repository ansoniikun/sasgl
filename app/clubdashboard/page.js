"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClubEventCard from "../components/ClubEventCard";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";

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
    <div className="">
      {/* Background Banner */}
      <div
        className="h-[40vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/clubdash.png')" }}
      ></div>

      {/* Tabs */}
      <div className="w-screen bg-gray-100">
        <div className="lg:max-w-2xl lg:ml-[25vw]">
          <ul className="flex text-sm sm:text-base text-ash-gray">
            {[
              "Club Members",
              "Club Scores",
              "Club Events",
              "Billing",
              "Subscriptions",
            ].map((tab) => (
              <li
                key={tab}
                className="py-3 px-5 cursor-pointer hover:text-dark-green hover:font-semibold border-b-2 border-transparent hover:border-dark-green"
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-wrap items-start gap-4 px-5">
        {/* Table */}
        <div className="lg:ml-[25vw] flex-1 bg-white rounded-xl shadow-md mt-4 overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead className="text-left border-b-1 border-b-gray-200 font-normal">
              <tr>
                <th className="p-3 font-normal">No</th>
                <th className="p-3 font-normal">Player Role</th>
                <th className="p-3 font-normal">Player Name</th>
                <th className="p-3 font-normal">Player Email</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal">Date Joined</th>
                <th className="p-3 font-normal">Score</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className=" hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 capitalize">{member.role}</td>
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3 text-lumo-green capitalize">
                    {member.status}
                  </td>
                  <td className="p-3">
                    {(() => {
                      const date = new Date(member.joined_at);
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      ); // Months are 0-indexed
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </td>
                  <td className="p-3">{member.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Poster */}
        <div className="hidden lg:block lg:min-w-[300px] lg:h-[400px] mt-5 px-5 lg:mr-[1vw] lg:ml-[1vw]">
          <img
            src="/ad.png"
            alt="Event Poster"
            className="rounded-xl shadow-lg object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Club info card */}
      <div className="absolute left-[29%] lg:top-[20vh] lg:left-[3vw]  w-[40%] lg:w-[20%] z-20">
        <div className="bg-white rounded-xl shadow-2xl p-6 text-center lg:text-left flex flex-col items-center h-[60vh]">
          <Image
            src={clubData.logo_url || "/placeholder.png"}
            alt="Club Logo"
            width={200}
            height={200}
            className="rounded-full mb-4 object-contain"
          />
          <h2 className="text-3xl font-semibold text-ash-gray mb-2">
            {clubData.name}
          </h2>
          <p className="text-sm text-gray-500">{clubData.description}</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button className="w-full bg-dark-green text-white font-medium py-2 rounded-lg">
            Edit Club
          </button>
          {["chairman", "captain"].includes(currentUserRole) && (
            <button className="w-full bg-dark-green text-white font-medium py-2 rounded-lg">
              Help & Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
