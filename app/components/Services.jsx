"use client";

const services = [
  {
    title: "Best Trainers",
    description:
      "Get access to certified and highly experienced golf coaches to help improve your game, whether you're a beginner or a seasoned player.",
  },
  {
    title: "Popular Courses",
    description:
      "Discover and play on some of the most well-reviewed and scenic golf courses across South Africa. We help you book and get started.",
  },
  {
    title: "Training Arenas",
    description:
      "Find top-rated golf training arenas near you equipped with advanced facilities for perfecting your swing and putting skills.",
  },
  {
    title: "Locally Produced Apparel",
    description:
      "Support local by browsing a range of high-quality, stylish golf apparel made by South African brands tailored for performance and comfort.",
  },
];

const Services = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-black">Our </span>
          <span className="text-dark-gold">Services</span>
        </h2>
        <div className="w-6 h-1 bg-dark-gold mx-auto mt-3" />
      </div>

      {/* Description */}
      <p className="text-center text-gray-700 text-lg md:text-xl max-w-3xl mx-auto mb-12">
        Listed below are some of the other services we cater for. All these are
        made available to make your golfing journey as smooth as possible.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold text-dark-gold mb-2">
              {service.title}
            </h3>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
