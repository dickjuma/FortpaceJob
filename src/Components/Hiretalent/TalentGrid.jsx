import React from "react";
import TalentCard from "./TalentCard";

const TalentGrid = ({ talents = [], loading = false }) => {
  if (loading) {
    return (
      <section className="talent-section">
        <div className="section-header">
          <h2>Top talent near you</h2>
          <p>Curated profiles with ratings, verified badges, and specialties.</p>
        </div>
        <div className="talent-grid">
          <div className="loading-message">Loading talent...</div>
        </div>
      </section>
    );
  }

  if (!talents || talents.length === 0) {
    return (
      <section className="talent-section">
        <div className="section-header">
          <h2>Top talent near you</h2>
          <p>Curated profiles with ratings, verified badges, and specialties.</p>
        </div>
        <div className="no-results">No talent found. Try a different search.</div>
      </section>
    );
  }

  return (
    <section className="talent-section">
      <div className="section-header">
        <h2>Top talent near you</h2>
        <p>Curated profiles with ratings, verified badges, and specialties.</p>
      </div>
      <div className="talent-grid">
        {talents.map((talent) => (
          <TalentCard 
            key={talent._id || talent.id} 
            talent={talent} 
          />
        ))}
      </div>
    </section>
  );
};

export default TalentGrid;
