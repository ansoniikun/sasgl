"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Replace this with your actual auth check
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Active Leagues", href: "/leagues" },
    { name: "Shop", href: "/shop" },
    { name: "Contact Us", href: "/#contact" },
    {
      name: isAuthenticated ? "Dashboard" : "Login",
      href: isAuthenticated ? "/dashboard" : "/login",
      isButton: true,
    },
  ];

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white/40  backdrop-blur-md shadow max-w-7xl w-full">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-dark-gold ${
                link.isButton &&
                " px-4 py-1 rounded-md bg-dark-gold text-white transition"
              } uppercase`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border-2 border-dark-gold rounded-md p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center py-4 animate-slide-down bg-black/40">
          {links.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`py-2 text-white hover:text-dark-gold transition w-full text-center uppercase ${
                index < links.length - 1 ? "border-b border-dark-gold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
