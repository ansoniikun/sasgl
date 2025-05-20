"use client";

import { useEffect, useRef } from "react";

const logos = [
  "/carousel1.jpg",
  "/carousel2.jpg",
  "/carousel3.png",
  "/carousel4.png",
  "/carousel5.png",
  "/carousel6.jpg",
  "/carousel1.jpg",
  "/carousel2.jpg",
  "/carousel3.png",
  "/carousel4.png",
  "/carousel5.png",
  "/carousel6.jpg",
];

const Carousel = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-6">
      <div className="overflow-hidden" ref={scrollRef}>
        <div className="flex gap-10 px-4 min-w-max">
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Golf association ${index + 1}`}
              className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
