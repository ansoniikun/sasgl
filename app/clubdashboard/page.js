"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClubEventCard from "../components/ClubEventCard";
import { API_BASE_URL } from "../lib/config";
import Image from "next/image";
import ClubCapture from "../components/ClubCapture";
import CreateClubEventForm from "../components/CreateClubEvents";
import ClubDashboardNav from "../components/ClubDashboardNav";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebase";

const ClubDashboard = () => {
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noClub, setNoClub] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [clubEvents, setClubEvents] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState("Club Members");
  const [leagueData, setLeagueData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [profilePicUrls, setProfilePicUrls] = useState({});

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

        let membersData = []; // define here

        if (membersRes.ok) {
          membersData = await membersRes.json();
          setMembers(membersData);
        }

        if (club?.id) {
          const leagueRes = await fetch(
            `${API_BASE_URL}/api/clubs/league/${club.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (leagueRes.ok) {
            const data = await leagueRes.json();
            setLeagueData(data);
          } else {
            console.warn("No league data available");
          }
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

        if (club.logo_url) {
          const logoRef = ref(storage, `club_logos/${club.logo_url}`);
          try {
            const url = await getDownloadURL(logoRef);
            setLogoUrl(url);
          } catch (err) {
            console.error("Failed to load club logo:", err);
          }
        }

        if (membersData.length > 0) {
          const urls = {};
          await Promise.all(
            membersData.map(async (member) => {
              if (member.profile_picture) {
                const picRef = ref(
                  storage,
                  `profile_pictures/${member.profile_picture}`
                );
                try {
                  const url = await getDownloadURL(picRef);
                  urls[member.id] = url;
                } catch (err) {
                  console.error(
                    `Failed to fetch profile picture for ${member.name}`,
                    err
                  );
                }
              }
            })
          );
          setProfilePicUrls(urls);
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
          method: "PATCH",
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
          Would you like to go back to your dashboard or{" "}
          {currentUserRole !== "chairman" && currentUserRole !== "captain"
            ? "join a club"
            : "register a new club"}
          ?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Go to Dashboard
          </button>
          {currentUserRole !== "chairman" && currentUserRole !== "captain" ? (
            <button
              onClick={() => router.push("/joinclub")}
              className="px-4 py-2 bg-dark-gold text-white rounded"
            >
              Join Club
            </button>
          ) : (
            <button
              onClick={() => router.push("/createclub")}
              className="px-4 py-2 bg-dark-gold text-white rounded"
            >
              Register New Club
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="">
      <ClubDashboardNav />
      {/* Background Banner */}
      <div
        className="relative h-[40vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/clubdash.png')" }}
      >
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">
          Club Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="w-screen bg-gray-50">
        <div className="lg:max-w-5xl lg:ml-[25vw]">
          <ul className="flex text-sm sm:text-base text-ash-gray">
            {[
              "Club Members",
              ...(currentUserRole === "chairman" ||
              currentUserRole === "captain"
                ? ["Capture Scores"]
                : []),
              "Leaderboard",
              "Club Events",
              "Billing",
              "Subscriptions",
            ].map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 cursor-pointer border-2 ${
                  activeTab === tab
                    ? "text-white font-semibold border-dark-green bg-dark-green"
                    : "border-transparent hover:text-white hover:font-semibold hover:border-dark-green hover:bg-dark-green"
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      {/* Table */}
      {activeTab === "Club Members" && (
        <div className="lg:ml-[25vw] lg:mr-[3vw] flex-1 bg-white rounded-xl shadow-md mt-4 overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead className="text-left border-b-1 border-b-gray-200 font-normal text-ash-gray">
              <tr>
                <th className="p-5 ">#</th>
                <th className="p-3 ">Image</th>
                <th className="p-3 ">Player Role</th>
                <th className="p-3 ">Player Name</th>
                <th className="">Player Email</th>
                <th className="p-3">Date Joined</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className=" hover:bg-gray-50 text-ash-gray">
                  <td className="pl-5">{index + 1}</td>
                  <td className="p-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                      {profilePicUrls[member.id] ? (
                        <Image
                          src={profilePicUrls[member.id]}
                          alt={`${member.name} profile`}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Image
                          src="/default-profile.png" // fallback image
                          alt="Default profile"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-2 capitalize">{member.role}</td>
                  <td className="p-2 capitalize">{member.name}</td>
                  <td className="capitalize">{member.email}</td>
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
                  <td className="p-3">{member.phone_number}</td>
                  <td className="p-3 text-ash-grey capitalize">
                    {member.status === "pending" &&
                    (currentUserRole === "captain" ||
                      currentUserRole === "chairman") ? (
                      <div className="flex gap-2">
                        <button
                          disabled={approvingIds.has(member.id)}
                          onClick={() => approveMember(member.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={approvingIds.has(member.id)}
                          onClick={() => rejectMember(member.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      member.status
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Leaderboard" && leagueData && (
        <div className="ml-[25vw] mr-[5vw] mb-[2vh] flex-1 bg-white rounded-xl shadow-md mt-4">
          <table className="w-full text-sm table-auto mt-2">
            <thead className="text-left border-b-1 border-b-gray-200 font-normal text-ash-gray">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Player Name</th>
                <th className="p-3">Games Played</th>
                <th className="p-3">Points</th>
                <th className="p-3">Birdies</th>
                <th className="p-3">Avg Points</th>
              </tr>
            </thead>
            <tbody>
              {leagueData.leaderboard.map((player, index) => (
                <tr
                  key={player.user_id}
                  className="text-ash-gray hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 capitalize">{player.name}</td>
                  <td className="p-3">{player.games_played}</td>
                  <td className="p-3">{player.points}</td>
                  <td className="p-3">{player.birdies}</td>
                  <td className="p-3">{player.avg_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "Capture Scores" &&
        (currentUserRole === "captain" || currentUserRole === "chairman" ? (
          <ClubCapture />
        ) : (
          <div className=" max-w-3xl mx-auto p-4 text-red-600 font-semibold">
            Only club captain and chairman can access this page.
          </div>
        ))}

      {activeTab === "Club Events" && (
        <div className="lg:ml-[25vw] lg:mr-[3vw] py-4 relative">
          {(currentUserRole === "captain" ||
            currentUserRole === "chairman") && (
            <>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mb-4 px-4 py-2 bg-dark-green text-white rounded"
              >
                Create Club Event
              </button>

              {showCreateModal && (
                <CreateClubEventForm
                  clubId={clubData.id}
                  onEventCreated={(newEvent) => {
                    setClubEvents((prev) => [...prev, newEvent]);
                    setShowCreateModal(false);
                  }}
                  onClose={() => setShowCreateModal(false)}
                />
              )}
            </>
          )}

          {clubEvents.length === 0 ? (
            <p className="text-center text-gray-600">No events yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubEvents.map((event) => (
                <ClubEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Club info card */}
      <div className="absolute left-[29%] lg:top-[20vh] lg:left-[3vw]  w-[40%] lg:w-[20%] z-20">
        <div className="bg-white rounded-xl shadow-2xl p-6 pt-10 text-center lg:text-left flex flex-col items-center h-[65vh]">
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <Image
              src={logoUrl || "/placeholder.png"}
              alt="Club Logo"
              width={192}
              height={192}
              className="object-cover w-full h-full block"
            />
          </div>
          <h2 className="text-3xl font-semibold text-ash-gray my-2 ">
            {clubData.name}
          </h2>
          <p className="text-sm text-gray-500 max-w-[90%]">
            {clubData.description}
          </p>
          <br />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {["chairman", "captain"].includes(currentUserRole) && (
            <button
              className="w-full bg-dark-green text-white font-medium py-2 rounded-lg"
              onClick={() => router.push("/edit-club")}
            >
              Edit Club
            </button>
          )}
          <button className="w-full bg-dark-green text-white font-medium py-2 rounded-lg">
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
