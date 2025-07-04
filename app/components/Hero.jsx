"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";

const images = ["/hero1.jpg", "/hero2.jpg", "/hero4.jpg"];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const slideInterval = useRef(null);

  const clearSlideInterval = () => {
    if (slideInterval.current) clearInterval(slideInterval.current);
  };

  const startSlideShow = () => {
    clearSlideInterval();
    slideInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const nextSlide = () => {
    clearSlideInterval();
    setCurrent((prev) => (prev + 1) % images.length);
    startSlideShow();
  };

  const prevSlide = () => {
    clearSlideInterval();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    startSlideShow();
  };

  useEffect(() => {
    startSlideShow();
    return clearSlideInterval;
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const loginCTA = useMemo(() => {
    if (!isLoggedIn) {
      return (
        <Link
          href="/register"
          className="bg-dark-gold hover:bg-dark-gold/90 text-white font-semibold px-6 py-2 rounded transition-all duration-200"
        >
          Register
        </Link>
      );
    }
    return null;
  }, [isLoggedIn]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Navbar />

      {/* Optimized Image Backgrounds */}
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-0 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Hero Slide ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}


      {/* Content Container - added pointer-events-auto */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        {/* Text Overlay */}
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl md:text-4xl font-semibold text-dark-gold drop-shadow">
            Social Golf League
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 drop-shadow">
            <span className="text-white">Welcome to </span>
            <span className="text-dark-gold">SA SGL</span>
          </h1>
          <p className="text-white text-lg md:text-2xl mt-4 max-w-2xl drop-shadow">
            South Africa's fastest growing golf social league
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap justify-center">
            {!isLoggedIn && (
              <Link
                href="/register"
                className="bg-dark-gold hover:bg-dark-gold/90 text-white font-semibold px-6 py-2 rounded transition-all duration-200"
              >
                Register
              </Link>
            )}
          </div>
        </div>

        {/* Arrows */}
        <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
          <button
            onClick={prevSlide}
            className="bg-white/50 p-2 rounded-full hover:bg-white transition pointer-events-auto"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/50 p-2 rounded-full hover:bg-white transition pointer-events-auto"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
