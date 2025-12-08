import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image3 from "../../Assets/Image3.jpg";
import { categories, } from "../../Assets/assets";
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

  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      setTyped(title.slice(0, idx + 1));
      idx++;
      if (idx >= title.length) {
        clearInterval(t);
        setTimeout(() => setShowCTA(true), 600);
      }
    }, 45);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const r = setInterval(
      () => setTagIndex((p) => (p + 1) % taglines.length),
      4000
    );
    return () => clearInterval(r);
  }, []);

  return (
    <div className="w-full overflow-x-hidden text-primary leading-relaxed">
      {/*----------------- HERO SECTION------------- */}
      <header className="relative h-screen w-screen flex justify-center items-center text-white text-center overflow-hidden bg-secondary">
        <img
          src={Image3}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover brightness-80 z-10"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/25 z-20" />

        <div className="relative z-30 max-w-4xl px-5 animate-fadeInUp">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {typed}
            <span className="text-accent-mint animate-pulse">|</span>
          </motion.h1>

          <motion.p
            key={tagIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-accent-mint mb-10 font-normal text-base sm:text-lg md:text-xl"
          >
            {taglines[tagIndex]}
          </motion.p>

          <div className="flex justify-center items-center flex-wrap gap-0 mb-8">
            <input
              placeholder="Search by skills, role or keywords..."
              className="flex-1 min-w-64 max-w-lg py-3.5 px-5 border-none outline-none rounded-l-3xl bg-secondary text-accent-mint text-base"
            />
            <button className="bg-[#B7E2BF] text-[var(primary)] border-none py-3.5 px-6 rounded-r-3xl text-base font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md">
              Search
            </button>
          </div>
        </div>
      </header>

      {/*------------------- CATEGORIES SECTION-------------------- */}
      <section className="w-full py-20 px-6 text-center bg-[var(--color-secondary)] overflow-hidden">
        <h2 className="text-3xl mb-3 font-bold text-[var(--color-primary)]">
          Explore Categories
        </h2>
        <p className="text-[var(--color-primary)] text-base mb-12">
          Find the perfect freelancer for any project or skill set.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {categories.map((c, i) => (
            <motion.div
              key={i}
              className="bg-[var(--accent-mint)] rounded-2xl shadow-sm overflow-hidden transition-all duration-300 cursor-pointer flex flex-col items-center text-center h-72 w-full max-w-xs hover:-translate-y-2 hover:shadow-lg group"
              whileHover={{ scale: 1.05 }}
            >
              {/*-------------- Icon container------------------ */}
              <div className="w-16 h-16 rounded-full bg-[var(--color-secondary)] flex items-center justify-center mt-8 mb-4  transition-all duration-300">
                <div className="text-2xl text-[var(--color-primary)] group-hover:text-[var(--accent-pink)] group-hover:scale-110 transition-all duration-300">
                  {c.icon}
                </div>
              </div>

              <h3 className="text-base font-semibold mt-2.5 mb-1 text-[var(--color-primary)] transition-colors duration-300">
                {c.name}
              </h3>
              <p className="text-gray-600 text-sm px-4 pb-2.5 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*-------------------- HOW IT WORKS SECTION -------*/}
      <section className="w-full py-12 px-6 text-center bg-[var(--color-secondary)] overflow-hidden">
        <div className="flex items-center justify-between  mt-4">
          <h2 className="text-3xl md:4xl lg:5xl mb-3 font-bold text-[var(--color-primary)]">
            How it Works
          </h2>
          <ToggleButton isHiring={isHiring} setIsHiring={setIsHiring} />
        </div>
        <div className="mt-4">
          <Cards isHiring={isHiring} setIsHiring={setIsHiring} />
        </div>
      </section>

      {/* ---------------CALL TO ACTION SECTION --------------*/}
      <CTA />
    </div>
  );
};

export default HomePage;
