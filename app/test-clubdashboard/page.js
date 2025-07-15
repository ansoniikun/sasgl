"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebase";
import { API_BASE_URL } from "../lib/config";
import ClubCapture from "../components/ClubCapture";

export default function DashboardPage() {
  const [clubData, setClubData] = useState(null);
  const [members, setMembers] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [profilePicUrls, setProfilePicUrls] = useState({});
  const [logoUrl, setLogoUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const membersPerPage = 12;

  const menuItems = [
    "Dashboard",
    "Club Members",
    "Capture Scores",
    "Leaderboard",
    "Club Events",
    "Billing",
  ];

  const accountItems = ["Edit Club", "Log out"];

  const banners = [
    { src: "/banners/test-clubdash5.png", alt: "ITU GOLF WEAR" },
    { src: "/banners/test-clubdash1.png", alt: "BMW Golf Cup" },
    { src: "/banners/test-clubdash2.png", alt: "Swing for a Cause" },
    { src: "/banners/test-clubdash4.png", alt: "Trusted by the Champion" },
    { src: "/banners/test-clubdash3.png", alt: "Better Golf" },
  ];

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams(window.location.search);
      const clubId = params.get("club");
      if (!clubId) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
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

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col justify-between">
        <div>
          <div className="p-6">
            <img src="/logo.jpg" alt="Logo" className="w-40 rounded-xl" />
          </div>
          <div className="mt-4 px-4 text-xs font-semibold text-gray-500">
            MENU
          </div>
          <nav className="space-y-1 px-4">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`flex items-center gap-2 font-medium py-2 rounded text-left w-full text-sm ${
                  activeTab === item
                    ? "bg-dark-green text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-4 px-4 text-xs font-medium text-gray-500">
            ACCOUNT PAGES
          </div>
          <nav className="space-y-1 px-4 mt-1">
            {accountItems.map((item) => (
              <button
                key={item}
                className="w-full text-left text-sm py-2 font-medium hover:bg-gray-100"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <button
            className="cursor-pointer w-full bg-dark-green text-white py-2 text-sm rounded"
            onClick={() => router.push("/dashboard")}
          >
            My Personal Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex gap-4 items-center">
            <select className="border px-3 py-1 rounded text-sm">
              <option>{clubData?.name || "Loading..."}</option>
            </select>
            <span className="material-icons text-gray-600">notifications</span>
          </div>
        </header>

        {/* Tabs */}
        <main className="p-6 space-y-6 flex-grow">
          {activeTab === "Dashboard" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow rounded p-4">
                  <p className="text-sm text-gray-500">Total Members</p>
                  <p className="text-lg font-bold text-dark-green">
                    {members.length} Players
                  </p>
                </div>
                <div className="bg-white shadow rounded p-4">
                  <p className="text-sm text-gray-500">Total Events Hosted</p>
                  <p className="text-lg font-bold text-dark-green">
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
              currentUserRole === "chairman") && <ClubCapture />}

          {activeTab === "Capture Scores" &&
            !["captain", "chairman"].includes(currentUserRole) && (
              <div className="text-red-600 font-semibold">
                Only club captain and chairman can access this page.
              </div>
            )}

          {activeTab === "Club Members" && (
            <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
              <h2 className="text-lg font-bold mb-4">Club Members</h2>
              <table className="w-full text-sm table-auto">
                <thead className="text-left border-b-1 border-b-gray-200 font-normal text-ash-gray">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members
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
                          ) : (
                            member.status
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center py-4 space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
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
                  className="px-3 py-1 bg-gray-200 text-sm rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === "Club Events" && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold mb-4">Club Events</h2>
              <ul className="space-y-2">
                {clubEvents.map((event) => (
                  <li key={event.id} className="border p-3 rounded">
                    <p className="text-dark-green font-semibold">
                      {event.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        <footer className="text-xs text-gray-500 py-4 bg-gray-100">
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
    </div>
  );
}
