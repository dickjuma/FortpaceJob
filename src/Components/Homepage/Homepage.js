import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";

const HomePage = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);

  const fullText = "Welcome to Fortespace";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 600);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { title: "Information Technology", icon: "" },
    { title: "Marketing & Sales", icon: "" },
    { title: "Customer Support", icon: "" },
    { title: "Human Resources", icon: "" },
    { title: "Finance & Accounting", icon: "" },
    { title: "Design & Creative", icon: "" },
    { title: "Engineering", icon: "" },
    { title: "Healthcare", icon: "" },
  ];

  const cities = [
    "Nairobi", "Mombasa", "Kisumu", "Eldoret", 
    "Nakuru", "Thika", "Machakos", "Naivasha",
      "Bungoma", "Busia", "Turkana", "Kilifi"
  ];

  const memberships = [
    { tier: "Basic", price: "Ksh:100", features: ["Access to job listings", "Email notifications", "Profile visibility"] },
    { tier: "Premium", price: "Ksh:500", features: ["Priority listings", "Employer insights", "Advanced job filters", "1-on-1 support"] },
    { tier: "Enterprise", price: "Ksh:1500", features: ["Dedicated account manager", "Team hiring tools", "Full analytics dashboard"] },
  ];

  return (
    <div className="home-page">
     
      <section className="home-container" id="hero">
        <motion.div
          className="home-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="home-title">
            {displayedText.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="cursor">|</span>
          </h1>

          {showButton && (
            <motion.button
              className="get-started-btn"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
            >
              Get-Started
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* ---- Categories Section ---- */}
      <section className="categories-section" id="categories">
        <h2 className="section-title">Explore Job Categories</h2>
        <p className="section-subtitle">
          Find your next opportunity in our top hiring sectors.
        </p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              className="category-card"
              whileHover={{ scale: 1.07, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Cities Section ---- */}
      <section className="cities-section">
        <h2 className="section-title">We’re Active In</h2>
        <p className="section-subtitle">Find opportunities in your city.</p>

        <div className="cities-grid">
          {cities.map((city, i) => (
            <motion.div
              key={i}
              className="city-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h3>{city}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Membership Section ---- */}
      <section className="membership-section">
        <h2 className="section-title">Join Forte space Membership</h2>
        <p className="section-subtitle">
          Unlock benefits that help you stand out and connect with top employers.
        </p>

        <div className="membership-grid">
          {memberships.map((plan, i) => (
            <motion.div
              key={i}
              className="membership-card"
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <h3 className="tier">{plan.tier}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
              <button className="join-btn">Join Now</button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
