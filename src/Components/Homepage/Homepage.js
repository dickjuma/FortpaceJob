import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image3 from "../../Assets/Image3.jpg";
import { categories } from "../../Assets/assets";
import ToggleButton from "../ToggleButton";
import Cards from "../Cards";
import CTA from "../CTA";

const HomePage = () => {
  const [typed, setTyped] = useState("");
  const [showCTA, setShowCTA] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [tagIndex, setTagIndex] = useState(0);

  const title =
    "A One Stop Shop for all your services and talent needs connecting clients to Experts";
  const taglines = [
    "Hire top freelancers in tech, design, marketing & more",
    "Find experts to bring your ideas to life",
    "Get projects done faster, smarter, and better",
    "Connect with talent and grow your business online",
  ];

  // Typing effect
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTyped(title.slice(0, idx + 1));
      idx++;
      if (idx >= title.length) {
        clearInterval(interval);
        setTimeout(() => setShowCTA(true), 600);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Rotating taglines
  useEffect(() => {
    const rotate = setInterval(() => {
      setTagIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(rotate);
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-[#F7F9FB] font-sans antialiased">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={Image3}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A312F]/80 to-[#4A312F]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            {typed}
            <span className="text-[#D34079] animate-pulse">|</span>
          </motion.h1>

          <motion.p
            key={tagIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-[#B7E2BF] mb-10"
          >
            {taglines[tagIndex]}
          </motion.p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by skill, role, or keyword..."
              className="flex-1 px-6 py-4 rounded-xl sm:rounded-r-none border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#D34079] focus:border-transparent transition"
            />
            <button className="px-8 py-4 bg-[#D34079] text-white font-semibold rounded-xl sm:rounded-l-none hover:bg-[#b12f65] transition shadow-lg hover:shadow-xl">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A312F] mb-3">
            Explore Categories
          </h2>
          <p className="text-[#4A312F]/70 text-lg mb-12">
            Find the perfect freelancer for any project or skill set.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-[#F7F9FB] rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#B7E2BF] flex items-center justify-center text-2xl text-[#4A312F] group-hover:bg-[#D34079] group-hover:text-white transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#4A312F] mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-[#4A312F]/70">
                  {category.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4A312F]">
              How it Works
            </h2>
            <ToggleButton isHiring={isHiring} setIsHiring={setIsHiring} />
          </div>
          <Cards isHiring={isHiring} setIsHiring={setIsHiring} />
        </div>
      </section>

      {/* Call to Action */}
      <CTA />
    </div>
  );
};

export default HomePage;