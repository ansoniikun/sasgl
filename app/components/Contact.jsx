"use client";

import { useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      setStatus("Email service not configured.");
      return;
    }

    const templateParams = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      description: formData.description,
      time: new Date().toLocaleString(),
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey).then(
      () => {
        setStatus("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          description: "",
        });
      },
      (error) => {
        setStatus("Failed to send message. Please try again.");
        console.error("EmailJS error:", error);
      }
    );
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
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg space-y-6"
        >
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
            required
          />

          <button
            type="submit"
            className="bg-dark-gold text-white font-semibold px-6 py-3 rounded hover:bg-yellow-700 transition"
          >
            Submit
          </button>

          {status && (
            <p
              className={`mt-4 ${
                status.includes("successfully")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
