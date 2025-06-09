"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add subscription logic here
    setEmail("");
  };

  return (
    <footer className="bg-black text-white py-12 px-4 md:px-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Golf Section */}
          <div>
            <h3 className="text-dark-gold text-xl mb-4">Golf</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-dark-gold transition">
                  &gt; Course Specials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-dark-gold transition">
                  &gt; Shop
                </a>
              </li>
            </ul>
          </div>

          {/* Events Section */}
          <div>
            <h3 className="text-dark-gold text-xl mb-4">Events</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-dark-gold transition">
                  &gt; Annual Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-dark-gold transition">
                  &gt; Tournaments
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h3 className="text-dark-gold text-xl mb-4">Contact Us</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Mail className="text-dark-gold" size={20} />
              <a
                href="mailto:admin@sasgl.co.za"
                className="hover:text-dark-gold transition break-all"
              >
                admin@sasgl.co.za
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-dark-gold text-xl mb-4">Our Newsletter</h3>
            <p className="mb-4">
              Enter your e-mail and subscribe to our newsletter.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col lg:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-full"
                required
              />
              <button
                type="submit"
                className="bg-dark-gold text-black  px-4 py-2 rounded hover:bg-yellow-600 transition w-full sm:w-auto"
              >
                SUBSCRIBE &gt;
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Social Golf League</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
