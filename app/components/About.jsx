"use client";

import Image from "next/image";

const About = () => {
  const features = [
    {
      title: "My Clubs",
      description:
        "We can link your account to multiple clubs and you will be able to track all your stats across the board. Let us do the hard work for you",
      image: "/hero1.jpg",
    },
    {
      title: "Timeline",
      description:
        "Now you can view all your achievements and upcoming events in one place, we think you will love it ",
      image: "/hero3.jpg",
    },
    {
      title: "Results",
      description:
        "Stay up-to-date with the latest competition results. We will bring you the latest news and stats and integrate them into your timeline so you can view all the data in just a few clicks",
      image: "/hero4.jpg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl">
          <span className="text-black">Welcome To </span>
          <span className="text-dark-gold">SA Social Golf League</span>
        </h1>
        {/* Small line */}
        <div className="w-5 h-1 bg-dark-gold mx-auto mt-4"></div>
      </div>

      {/* Description */}
      <div className="text-center mb-16">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          SA SGL is the fastest growing network of golfers in South Africa.
          Holding league results and Tournament scores of over 500 men and
          women.
        </p>
      </div>

      {/* Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full"
          >
            {/* Image Container - now with fixed height */}
            <div className="w-full h-64 md:h-80 relative">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Hover Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex flex-col justify-end p-6 
  opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <div className="transform translate-y-0 md:translate-y-10 md:group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
