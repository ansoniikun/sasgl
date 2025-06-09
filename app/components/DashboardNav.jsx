"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../utils/logout";
import { useRouter } from "next/navigation";

const DashboardNav = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // remove token and redirect
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Join Club", href: "/joinclub" },
    { name: "Leaderboard", href: "/leagues" },
    ...(role === "captain" || role === "chairman"
      ? [{ name: "Create Club", href: "/createclub" }]
      : []),
    { name: "My Dashboard", href: "/dashboard" },
    { name: "Club Dashboard", href: "/clubdashboard" },
  ];

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white/40 backdrop-blur-md shadow max-w-7xl w-full">
      <div className="px-5 py-3 flex justify-between items-center">
        {/* Logo */}
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

export default DashboardNav;
