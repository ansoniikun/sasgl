"use client";

import { useState } from "react";
import Image from "next/image";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero3.jpg"
          alt="Golf course background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm z-1" />

      <div className="relative z-10 max-w-4xl mx-auto text-white py-20 px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl ">
            <span className="text-white">Contact </span>
            <span className="text-dark-gold">Us</span>
          </h2>
          <div className="w-6 h-1 bg-dark-gold mx-auto mt-3" />
        </div>

        {/* Form */}
        <form className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="p-3 rounded bg-white/80 text-black outline-1 outline-gray-200 w-full focus:outline-dark-gold"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="p-3 rounded bg-white/80 text-black outline-1 outline-gray-200 w-full focus:outline-dark-gold"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded bg-white/80 text-black outline-1 outline-gray-200 w-full focus:outline-dark-gold"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded bg-white/80 text-black outline-1 outline-gray-200 w-full focus:outline-dark-gold"
            />
          </div>

          <textarea
            name="description"
            placeholder="Your Message..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded bg-white/80 text-black outline-1 outline-gray-200 focus:outline-dark-gold"
          />

          <button
            type="submit"
            className="bg-dark-gold text-white font-semibold px-6 py-3 rounded hover:bg-yellow-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
