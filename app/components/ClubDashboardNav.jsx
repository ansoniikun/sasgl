"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../utils/logout";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";

const ClubDashboardNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [userClubs, setUserClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const params = new URLSearchParams(window.location.search);
    const clubIdFromUrl = params.get("club");
    setSelectedClubId(clubIdFromUrl || "");

    const fetchClubs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clubs/myclubs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUserClubs(data);
        }
      } catch (err) {
        console.error("Error fetching user clubs:", err);
      }
    };

    fetchClubs();
  }, []);

  const handleClubSelect = (clubId) => {
    setSelectedClubId(clubId);
    window.location.href = `/clubdashboard?club=${clubId}`;
  };

  const handleLogout = () => {
    logout();
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Active Leagues", href: "/leagues" },
    { name: "My Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white/40 backdrop-blur-md shadow max-w-7xl w-full">
      <div className="px-5 py-3 flex justify-between items-center">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={200}
          height={200}
          className="object-contain h-fill"
          priority
        />

        <div className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-dark-gold uppercase"
            >
              {link.name}
            </Link>
          ))}

          {userClubs.length > 0 && (
            <select
              onChange={(e) => handleClubSelect(e.target.value)}
              value={selectedClubId}
              className="uppercase border border-dark-gold px-2 py-1 rounded-md bg-white text-gray-800 hover:cursor-pointer"
            >
              <option disabled value="">
                Club Dashboard
              </option>
              {userClubs.map((club) => (
                <option key={club.id} value={club.id} className="text-black">
                  {club.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleLogout}
            className="uppercase px-4 py-1 rounded-md bg-dark-gold text-white transition hover:bg-yellow-600"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border-2 border-dark-gold rounded-md p-1"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col items-center py-4 animate-slide-down">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="py-2 text-gray-800 hover:text-dark-gold transition w-full text-center uppercase border-b border-gray-300"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
                    {userClubs.length > 0 &&
            userClubs.map((club) => (
              <button
                key={club.id}
                onClick={() => {
                  setIsOpen(false);
                  handleClubSelect(club.id);
                }}
                className="py-2 text-gray-800 hover:text-dark-gold transition w-full text-center uppercase border-b border-gray-300"
              >
                {club.name} Dashboard
              </button>
            ))}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="py-2 text-gray-800 hover:text-dark-gold transition w-full text-center uppercase"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default ClubDashboardNav;
