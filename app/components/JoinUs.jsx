"use client";

import Link from "next/link";

const JoinUs = () => {
  return (
    <section className="relative h-[40vh] w-full bg-black">
      {/* Content */}
      <div className="h-full flex flex-col justify-center items-center text-center px-4 text-white">
        <h2 className="text-3xl md:text-4xl ">
          <span className="text-dark-gold">Join</span> Club Now
        </h2>
        <div className="w-5 h-1 bg-dark-gold mt-3 mb-4" />
        <p className="text-lg md:text-xl max-w-2xl">
          Browse our list of local clubs grouped by provinces and request to
          join.
        </p>
        <Link
          href="/register"
          className="mt-6 bg-dark-gold text-white font-semibold px-6 py-3 rounded transition hover:opacity-90"
        >
          Join Now
        </Link>
      </div>
    </section>
  );
};

export default JoinUs;
