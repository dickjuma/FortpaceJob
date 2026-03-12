import React from "react";

const Filters = ({ onFilterChange, selectedFilters = {} }) => {
  const filterOptions = {
    serviceType: ["Physical on-site", "Hybrid", "Fully online"],
    microSectors: ["Wiring", "Engine diagnostics", "HVAC", "Solar install"],
    location: ["Nairobi", "London", "Remote", "New York"],
    budget: ["Under $25/hr", "$25-50/hr", "Project-based"]
  };

  const handleFilterClick = (filterType, value) => {
    const currentFilters = selectedFilters[filterType] || [];
    let newFilters;
    
    if (currentFilters.includes(value)) {
      newFilters = currentFilters.filter(f => f !== value);
    } else {
      newFilters = [...currentFilters, value];
    }
    
    onFilterChange?.({ ...selectedFilters, [filterType]: newFilters });
  };

  return (
    <section className="talent-section split">
      <div className="section-header">
        <h2>Filter and hire with confidence</h2>
        <p>Use detailed filters inspired by Fiverr, while keeping Forte's trust layer.</p>
      </div>
      <div className="filter-grid">
        <div className="filter-box">
          <h4>Service Type</h4>
          <div className="tag-row">
            {filterOptions.serviceType.map((item) => (
              <span 
                key={item}
                onClick={() => handleFilterClick("serviceType", item)}
                style={{ 
                  cursor: "pointer",
                  background: (selectedFilters.serviceType || []).includes(item) ? "var(--cta)" : "var(--accent1)",
                  color: (selectedFilters.serviceType || []).includes(item) ? "#fff" : "inherit"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="filter-box">
          <h4>Micro Sectors</h4>
          <div className="tag-row">
            {filterOptions.microSectors.map((item) => (
              <span 
                key={item}
                onClick={() => handleFilterClick("microSectors", item)}
                style={{ 
                  cursor: "pointer",
                  background: (selectedFilters.microSectors || []).includes(item) ? "var(--cta)" : "var(--accent1)",
                  color: (selectedFilters.microSectors || []).includes(item) ? "#fff" : "inherit"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="filter-box">
          <h4>Location</h4>
          <div className="tag-row">
            {filterOptions.location.map((item) => (
              <span 
                key={item}
                onClick={() => handleFilterClick("location", item)}
                style={{ 
                  cursor: "pointer",
                  background: (selectedFilters.location || []).includes(item) ? "var(--cta)" : "var(--accent1)",
                  color: (selectedFilters.location || []).includes(item) ? "#fff" : "inherit"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="filter-box">
          <h4>Budget</h4>
          <div className="tag-row">
            {filterOptions.budget.map((item) => (
              <span 
                key={item}
                onClick={() => handleFilterClick("budget", item)}
                style={{ 
                  cursor: "pointer",
                  background: (selectedFilters.budget || []).includes(item) ? "var(--cta)" : "var(--accent1)",
                  color: (selectedFilters.budget || []).includes(item) ? "#fff" : "inherit"
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filters;
