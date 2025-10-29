import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";
import Image3 from "../../Assets/Image3.jpg";
import Image from "../../Assets/Coloredlogo.jpg";
import Image1 from "../../Assets/image2.jpg";

const HomePage = () => {
  const [typed, setTyped] = useState("");
  const [showCTA, setShowCTA] = useState(false);
  const [tagIndex, setTagIndex] = useState(0);

  const title = "Welcome to Fortespace";
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
    const r = setInterval(() => setTagIndex((p) => (p + 1) % taglines.length), 4000);
    return () => clearInterval(r);
  }, []);

  const categories = [
    { name: "Design & Creative", desc: "Branding, logos, UI/UX, illustration", img: Image },
    { name: "Development & Tech", desc: "Websites, apps, software, AI & automation", img: Image },
    { name: "Digital Marketing", desc: "SEO, social media, advertising, content marketing", img: Image },
    { name: "Writing & Translation", desc: "Copywriting, blogs, translations, editing", img: Image },
    { name: "Video & Animation", desc: "Editing, motion graphics, explainer videos", img: Image },
    { name: "Business & Admin", desc: "Data entry, virtual assistance, consulting", img: Image },
    { name: "Business & Admin", desc: "Data entry, virtual assistance, consulting", img: Image },
    { name: "Business & Admin", desc: "Data entry, virtual assistance, consulting", img: Image },
  ];

  const freelancers = [
    { name: "Dickson j.", role: "Logo Designer", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "Full-Stack Developer", rating: 4.8, img: Image1 },
    { name: "Dickson j.", role: "Social Media Expert", rating: 5.0, img: Image1 },
    { name: "Dickson j.", role: "Video Editor", rating: 4.7, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
    { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  ];

  const trendingProjects = [
    { name: "E-commerce Website", price: "from Ksh 2,500", img: Image },
    { name: "Brand Logo Design", price: "from Ksh 500", img: Image },
    { name: "Social Media Campaign", price: "from Ksh 700", img: Image },
    { name: "Explainer Video", price: "from Ksh 900", img: Image },
    { name: "Explainer Video", price: "from Ksh 900", img: Image },
    { name: "Explainer Video", price: "from Ksh 900", img: Image },
    { name: "Explainer Video", price: "from Ksh 900", img: Image },
    { name: "Explainer Video", price: "from Ksh 900", img: Image },
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <header className="hero-section">
        {/* ✅ Fixed: replaced <Image> tag with proper <img> */}
        <img src={Image3} alt="Hero background" className="hero-video" />

        <div className="hero-overlay" />
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            {typed}
            <span className="cursor">|</span>
          </motion.h1>

          <motion.p
            key={tagIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="hero-tagline"
          >
            {taglines[tagIndex]}
          </motion.p>

          <div className="hero-search">
            <input placeholder="Search for freelancers or services..." />
            <button>Search</button>
          </div>

          {showCTA && (
            <motion.button className="hero-cta" whileHover={{ scale: 1.05 }}>
              Get Started
            </motion.button>
          )}
        </div>
      </header>

      {/* CATEGORIES SECTION */}
      <section className="categories-section full-width">
        <h2>Explore Categories</h2>
        <p>Find the perfect freelancer for any project or skill set.</p>
        <div className="categories-grid">
          {categories.map((c, i) => (
            <motion.div key={i} className="category-card" whileHover={{ scale: 1.05 }}>
              <img src={c.img} alt={c.name} loading="lazy" />
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FREELANCERS SECTION */}
      <section className="freelancers-section full-width">
        <h2>Top Rated Freelancers</h2>
        <p>Hand-picked professionals ready to start your project.</p>
        <div className="freelancers-carousel">
          {freelancers.map((f, i) => (
            <motion.div key={i} className="freelancer-card" whileHover={{ scale: 1.05 }}>
              <img src={f.img} alt={f.name} loading="lazy" />
              <h3>{f.name}</h3>
              <p>{f.role}</p>
              <p>⭐ {f.rating}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING PROJECTS SECTION */}
      <section className="trending-section full-width">
        <h2>Trending Projects</h2>
        <p>Most requested services by clients this month.</p>
        <div className="trending-grid">
          {trendingProjects.map((t, i) => (
            <motion.div key={i} className="trending-card" whileHover={{ y: -8 }}>
              <img src={t.img} alt={t.name} loading="lazy" />
              <h3>{t.name}</h3>
              <p>{t.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPULAR BADGES SECTION */}
      <section className="badges-section full-width">
        <h2>Popular Services</h2>
        <div className="badges-grid">
          {categories.map((c, i) => (
            <motion.div key={i} className="badge-card" whileHover={{ scale: 1.05 }}>
              <p>{c.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="cta-section full-width">
        <motion.h2 whileHover={{ scale: 1.02 }}>
          Ready to hire top freelancers or start your project?
        </motion.h2>
        <motion.button whileHover={{ scale: 1.05 }}>Explore Services</motion.button>
      </section>
    </div>
  );
};

export default HomePage;
