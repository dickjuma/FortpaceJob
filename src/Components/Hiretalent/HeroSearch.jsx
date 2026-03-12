import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [serviceType, setServiceType] = React.useState("All services");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (serviceType && serviceType !== "All services") params.set("serviceMode", serviceType);
    navigate(`/talent/request?${params.toString()}`);
  };

  return (
    <section className="talent-hero">
      <div className="talent-hero-content">
        <p className="eyebrow">Hire talent you can trust</p>
        <h1>Find verified pros for physical and online services</h1>
        <p className="subhead">
          Book electricians, mechanics, designers, developers, and more. All in one marketplace.
        </p>
        <form className="talent-search" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What service do you need?"
          />
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option>All services</option>
            <option>Physical on-site</option>
            <option>Fully online</option>
            <option>Hybrid</option>
          </select>
          <button type="submit">Search</button>
        </form>
        <div className="hero-stats">
          <div>
            <h3>50k+</h3>
            <p>Verified experts</p>
          </div>
          <div>
            <h3>120+</h3>
            <p>Service categories</p>
          </div>
          <div>
            <h3>4.9/5</h3>
            <p>Average rating</p>
          </div>
        </div>
      </div>
      <div className="talent-hero-card">
        <h4>Popular right now</h4>
        <div className="pill-grid">
          <span>Panel upgrades</span>
          <span>Auto diagnostics</span>
          <span>HVAC repair</span>
          <span>Brand design</span>
          <span>Web build</span>
          <span>Solar install</span>
        </div>
        <div className="hero-card-footer">
          <p>Get matched in minutes.</p>
          <a className="ghost" href="/talent/request">Post a request</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
