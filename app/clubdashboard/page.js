"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";
import { API_BASE_URL } from "../lib/config";
import { logout } from "../utils/logout";
import ClubCapture from "../components/ClubCapture";
import ClubEventCard from "../components/ClubEventCard";
import CreateClubEventModal from "../components/CreateClubEvents";

export default function DashboardPage() {
  const [clubData, setClubData] = useState(null);
  const [members, setMembers] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [profilePicUrls, setProfilePicUrls] = useState({});
  const [leagueData, setLeagueData] = useState({ leaderboard: [] });
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [leaderboardPerPage, setLeaderboardPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fileInputRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);

  const [logoUrl, setLogoUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const menuItems = [
    {
      label: "Dashboard",
      icon: "/clubdash/dashboard.png",
      icon_select: "/clubdash/dashboard-select.png",
    },
    {
      label: "Club Members",
      icon: "/clubdash/members.png",
      icon_select: "/clubdash/members-select.png",
    },
    {
      label: "Capture Scores",
      icon: "/clubdash/scores.png ",
      icon_select: "/clubdash/scores-select.png",
    },
    {
      label: "Leaderboard",
      icon: "/clubdash/leaderboard.png",
      icon_select: "/clubdash/leaderboard-select.png",
    },
    {
      label: "Club Events",
      icon: "/clubdash/events.png",
      icon_select: "/clubdash/events-select.png",
    },
    {
      label: "Billing",
      icon: "/clubdash/billing.png",
      icon_select: "/clubdash/billing-select.png",
    },
  ];

  const accountItems = [
    { label: "Edit Club", icon: "/clubdash/edit.png" },
    { label: "Log out", icon: "/clubdash/logout.png" },
  ];

  const banners = [
    { src: "/banners/test-clubdash5.png", alt: "ITU GOLF WEAR" },
    { src: "/banners/test-clubdash1.png", alt: "BMW Golf Cup" },
    { src: "/banners/adspace_small.png", alt: "Swing for a Cause" },
    { src: "/banners/adspace_large.png", alt: "Trusted by the Champion" },
    { src: "/banners/adspace_small.png", alt: "Better Golf" },
  ];

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams(window.location.search);
      const clubId = params.get("club");
      if (clubId) setSelectedClubId(clubId);

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const clubsRes = await fetch(`${API_BASE_URL}/api/clubs/myclubs`, {
          headers,
        });
        if (clubsRes.ok) {
          const userClubsData = await clubsRes.json();
          setUserClubs(userClubsData);
        }

        const [userRes, clubRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/me`, { headers }),
          fetch(`${API_BASE_URL}/api/clubs/${clubId}`, { headers }),
        ]);

        if (!userRes.ok || !clubRes.ok) return;

        const user = await userRes.json();
        const club = await clubRes.json();

        setCurrentUserRole(user.role);
        setClubData(club);

        const [membersRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/clubs/${club.id}/members`, { headers }),
          fetch(`${API_BASE_URL}/api/events/club/${club.id}`, { headers }),
        ]);

        const membersData = await membersRes.json();
        const eventsData = await eventsRes.json();

        setMembers(membersData);
        setClubEvents(eventsData);

        const urls = {};
        await Promise.all(
          membersData.map(async (m) => {
            if (m.profile_picture) {
              try {
                urls[m.id] = await getDownloadURL(
                  ref(storage, `profile_pictures/${m.profile_picture}`)
                );
              } catch (err) {
                console.warn(`No profile picture for ${m.name}`);
              }
            }
          })
        );
        setProfilePicUrls(urls);

        const leagueRes = await fetch(
          `${API_BASE_URL}/api/clubs/league/${club.id}`,
          { headers }
        );
        const league = leagueRes.ok
          ? await leagueRes.json()
          : { leaderboard: [] };
        setLeagueData(league);

        if (club.logo_url) {
          try {
            const url = await getDownloadURL(
              ref(storage, `club_logos/${club.logo_url}`)
            );
            setLogoUrl(url);
          } catch (err) {
            console.warn("Error loading logo:", err);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    if (typeof window !== "undefined") fetchData();
  }, []);

  const approveMember = async (memberId) => {
    const token = getToken();
    if (!token) return;

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
    if (!token) return;

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
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  const handleUpdateClub = async () => {
    const token = getToken();
    if (!token) return;

    let uploadedLogo = clubData.logo_url; // default to current logo

    try {
      // If a new logo file is selected, upload it
      if (logoFile) {
        const timestamp = Date.now();
        const cleanName = (clubData.name || "club").replace(/\s+/g, "");
        const fileName = `${timestamp}_${cleanName}_${logoFile.name}`;
        const storageRef = ref(storage, `club_logos/${fileName}`);

        await uploadBytes(storageRef, logoFile);
        uploadedLogo = fileName;
      }

      // Send PATCH request to update club details
      const res = await fetch(`${API_BASE_URL}/api/clubs/${clubData.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...clubData,
          logo: uploadedLogo,
        }),
      });

      if (res.ok) {
        alert("Club updated successfully!");
        // Switch to dashboard tab
        if (typeof setActiveTab === "function") {
          setActiveTab("Dashboard");
        }
        // Reload page
        window.location.reload();
      } else {
        alert("Failed to update club");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating club");
    }
  };

  const removeMember = async (memberId) => {
    const token = getToken();
    if (!token) return;

    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/clubs/${clubData.id}/members/${memberId}/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        alert("Member removed successfully");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      alert("An error occurred while removing member");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between h-screen">
        <div>
          <div
            className="p-6 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <img src="/logo.png" alt="Logo" className=" w-40 rounded-xl" />
          </div>
          <div className="mt-4 px-4 text-xs font-semibold text-gray-500">
            MENU
          </div>
          <nav className="space-y-1 px-4">
            {menuItems
              .filter((item) => {
                if (item.label === "Capture Scores") {
                  return (
                    currentUserRole === "captain" ||
                    currentUserRole === "chairman"
                  );
                }
                return true;
              })
              .map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-2 font-medium py-2 rounded text-left w-full text-sm cursor-pointer ${
                    activeTab === item.label
                      ? " px-4"
                      : "text-gray-400 hover:px-3"
                  }`}
                >
                  <img
                    src={
                      activeTab === item.label ? item.icon_select : item.icon
                    }
                    alt={item.label + " icon"}
                    className={`w-8 h-8 p-2 border rounded-lg ${
                      activeTab === item.label
                        ? "border-dark-green bg-dark-green"
                        : "border-brown-gray bg-brown-gray"
                    } `}
                  />
                  {item.label}
                </button>
              ))}
          </nav>

          <div className="mt-4 px-4 text-xs font-medium text-gray-500">
            ACCOUNT PAGES
          </div>
          <nav className="space-y-1 px-4 mt-1">
            {accountItems
              .filter((item) => {
                if (item.label === "Edit Club") {
                  return (
                    currentUserRole === "captain" ||
                    currentUserRole === "chairman"
                  );
                }
                return true;
              })
              .map((item) => (
                <button
                  key={item.label}
                  className="flex items-center text-gray-400 gap-2 font-medium py-2 text-left w-full text-sm cursor-pointer rounded"
                  onClick={() => {
                    if (item.label === "Log out") {
                      logout();
                    } else if (item.label === "Edit Club") {
                      setActiveTab(item.label);
                    }
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label + " icon"}
                    className="w-8 h-8 p-2 border border-brown-gray bg-brown-gray rounded-lg"
                  />
                  {item.label}
                </button>
              ))}
          </nav>
        </div>
        <div className="p-4">
          <button
            className="cursor-pointer w-full bg-dark-green text-white py-4 text-sm rounded-xl"
            onClick={() => router.push("/dashboard")}
          >
            My Personal Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen pt-5 px-5 overflow-y-auto">
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex flex-col">
            <div className="flex space-x-1 items-center">
              <div className="relative w-3 h-3">
                <Image
                  src="/dashnav.png"
                  fill
                  alt="dash nav logo"
                  className="object-cover"
                />
              </div>
              <h1 className="text-sm">/ Dashboard</h1>
            </div>
            <span className="text-ash-gray mt-1 font-medium">{activeTab}</span>
          </div>

          <div className="flex gap-4 items-center">
            <select
              className="border px-3 py-3 rounded-xl text-sm border-gray-300"
              value={clubData?.id || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                window.location.href = `/clubdashboard?club=${selectedId}`;
              }}
            >
              <option disabled value="">
                Select a Club
              </option>
              {userClubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>

            {logoUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={logoUrl}
                  alt="Club Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                No Logo
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <main className="p-6 space-y-6 flex-grow">
          {activeTab === "Dashboard" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow rounded-xl p-4">
                  <p className="text-sm text-gray-500">Total Members</p>
                  <p className="text-lg font-semibold text-dark-green">
                    {members.length} Players
                  </p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                  <p className="text-sm text-gray-500">Total Events Hosted</p>
                  <p className="text-lg font-semibold text-dark-green">
                    {clubEvents.length} Games
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-5 auto-rows-[255px]">
                {banners.map((banner, idx) => {
                  const spanStyles = [
                    "col-span-5 row-span-1",
                    "col-span-3 row-span-1",
                    "col-span-2 row-span-1",
                    "col-span-4 row-span-1",
                    "col-span-2 row-span-1",
                  ];
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden shadow bg-white p-3 ${
                        spanStyles[idx] || "col-span-2 row-span-1"
                      }`}
                    >
                      <img
                        src={banner.src}
                        alt={banner.alt}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "Capture Scores" &&
            (currentUserRole === "captain" ||
              currentUserRole === "chairman") && (
              <ClubCapture clubId={selectedClubId} />
            )}

          {activeTab === "Capture Scores" &&
            !["captain", "chairman"].includes(currentUserRole) && (
              <div className="text-red-600 font-semibold">
                Only club captain and chairman can access this page.
              </div>
            )}

          {activeTab === "Club Members" && (
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Club Members
              </h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="membersPerPage"
                  className="text-sm text-gray-600"
                >
                  Show:
                </label>
                <select
                  id="membersPerPage"
                  className="border rounded px-2 py-1 text-sm border-gray-200"
                  value={membersPerPage}
                  onChange={(e) => {
                    setMembersPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page whenever selection changes
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <label
                  htmlFor="membersPerPage"
                  className="text-sm text-gray-600"
                >
                  Members
                </label>
              </div>
              <table className="w-full text-sm table-auto">
                <thead className="text-left border-b-1 border-b-gray-200 text-black">
                  <tr>
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Image</th>
                    <th className="p-3 font-medium">Role</th>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Joined</th>
                    <th className="p-3 font-medium">Phone</th>
                    <th className="p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .slice() // make a shallow copy so you don't mutate state
                    .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically by name
                    .slice(
                      (currentPage - 1) * membersPerPage,
                      currentPage * membersPerPage
                    )
                    .map((member, index) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 text-ash-gray"
                      >
                        <td className="p-3">
                          {(currentPage - 1) * membersPerPage + index + 1}
                        </td>
                        <td className="p-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                            <Image
                              src={
                                profilePicUrls[member.id] ||
                                "/default-profile.png"
                              }
                              alt={`${member.name} profile`}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        <td className="p-3 capitalize">{member.role}</td>
                        <td className="p-3 capitalize">{member.name}</td>
                        <td className="p-3">{member.email}</td>
                        <td className="p-3">
                          {new Date(member.joined_at).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="p-3">{member.phone_number}</td>
                        <td className="p-3 capitalize">
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
                          ) : member.status === "approved" &&
                            (currentUserRole === "captain" ||
                              currentUserRole === "chairman") ? (
                            <div className="flex gap-4 items-center">
                              <span className="capitalize">
                                {member.status}
                              </span>
                              <button
                                onClick={() => removeMember(member.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-3xl hover:bg-red-600"
                              >
                                Remove
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

              <hr className="my-4 border-gray-200" />

              {/* bottom controls */}
              <div className="flex justify-between items-center">
                {/* left side text */}
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {Math.min(currentPage * membersPerPage, members.length)} of{" "}
                  {members.length} members
                </div>

                {/* right side pagination */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-400 text-sm rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from(
                    { length: Math.ceil(members.length / membersPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === i + 1
                            ? "bg-dark-green text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(members.length / membersPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(members.length / membersPerPage)
                    }
                    className="px-3 py-1 border border-gray-400 text-sm rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Club Events" && (
            <div className="rounded-xl">
              {/* Create Event Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-dark-green text-white rounded-lg shadow"
                >
                  Create Club Event
                </button>
              </div>

              {/* Banners */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {banners.slice(0, 2).map((banner, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden shadow">
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Club events list */}
              {clubEvents.length === 0 ? (
                <p className="text-gray-500">
                  No events available for this club.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {clubEvents.map((event) => (
                    <ClubEventCard
                      key={event.id}
                      event={event}
                      clubId={clubData?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Leaderboard" && (
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Club Leaderboard
              </h2>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="membersPerPage"
                  className="text-sm text-gray-600"
                >
                  Show:
                </label>
                <select
                  id="leaderboardPerPage"
                  className="border rounded px-2 py-1 text-sm border-gray-200"
                  value={leaderboardPerPage}
                  onChange={(e) => {
                    setLeaderboardPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page whenever selection changes
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <label
                  htmlFor="membersPerPage"
                  className="text-sm text-gray-600"
                >
                  Members
                </label>
              </div>
              <table className="w-full text-sm table-auto">
                <thead className="text-left border-b-1 border-b-gray-200 font-normal text-ash-gray">
                  <tr>
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">Player Name</th>
                    <th className="p-3 font-medium">Game 1</th>
                    <th className="p-3 font-medium">Game 2</th>
                    <th className="p-3 font-medium">Game 3</th>
                    <th className="p-3 font-medium">Game 4</th>
                    <th className="p-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueData.leaderboard
                    .slice(
                      (currentPage - 1) * leaderboardPerPage,
                      currentPage * leaderboardPerPage
                    )
                    .map((player, index) => (
                      <tr
                        key={player.user_id}
                        className="hover:bg-gray-50 text-ash-gray"
                      >
                        <td className="p-3">
                          {(currentPage - 1) * leaderboardPerPage + index + 1}
                        </td>
                        <td className="p-3 capitalize">{player.name}</td>
                        {[0, 1, 2, 3].map((i) => (
                          <td key={i} className="p-3">
                            {player.scores[i] !== undefined
                              ? player.scores[i]
                              : "-"}
                          </td>
                        ))}
                        <td className="p-3 font-semibold">
                          {player.scores.reduce((sum, s) => sum + s, 0)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <hr className="my-4 border-gray-200" />

              {/* bottom controls */}
              <div className="flex justify-between items-center">
                {/* left side text */}
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {Math.min(currentPage * leaderboardPerPage, members.length)}{" "}
                  of {members.length} members
                </div>

                {/* right side pagination */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 text-sm rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from(
                    { length: Math.ceil(members.length / leaderboardPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === i + 1
                            ? "bg-dark-green text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(members.length / leaderboardPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(members.length / leaderboardPerPage)
                    }
                    className="px-3 py-1 border border-gray-300 text-sm rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Edit Club" && clubData && (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-700">Edit Club</h2>

              {/* Club Logo at top with overlay edit */}
              <div className="flex flex-col items-start space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Club Logo
                </label>

                <div className="relative group w-60 h-50 border border-gray-300 rounded-lg overflow-hidden">
                  {logoUrl ? (
                    <>
                      <Image
                        src={logoUrl}
                        alt="Club Logo"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 text-white bg-blue-400 text-sm font-medium rounded-xl shadow cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-60 h-50 border border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      No Logo
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setLogoFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Inputs underneath */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Club Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Club Name
                  </label>
                  <input
                    type="text"
                    value={clubData.name || ""}
                    onChange={(e) =>
                      setClubData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                  />
                </div>

                {/* Home Estate */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Home Estate
                  </label>
                  <input
                    type="text"
                    value={clubData.home_estate || ""}
                    onChange={(e) =>
                      setClubData((prev) => ({
                        ...prev,
                        home_estate: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Country
                  </label>
                  <select
                    value={clubData.country || ""}
                    onChange={(e) =>
                      setClubData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                  >
                    <option value="South Africa">South Africa</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    {/* add more */}
                  </select>
                </div>

                {/* Established Year */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Established Year
                  </label>
                  <select
                    value={clubData.established_year || ""}
                    onChange={(e) =>
                      setClubData((prev) => ({
                        ...prev,
                        established_year: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                  >
                    {Array.from({ length: 50 }, (_, i) => 1980 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  value={clubData.description || ""}
                  onChange={(e) =>
                    setClubData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-400"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateClub}
                  className="px-4 py-2 bg-dark-green text-white rounded-lg cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="text-xs text-gray-500 py-4 bg-gray-50">
          <div className="flex justify-between items-center px-6 mx-auto">
            <span>© 2025 Social Golf League</span>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">
                About Us
              </a>
              <a href="#" className="hover:underline">
                Terms of Use
              </a>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
      {showCreateModal && (
        <CreateClubEventModal
          clubId={clubData?.id}
          onEventCreated={(newEvent) =>
            setClubEvents((prev) => [...prev, newEvent])
          }
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
