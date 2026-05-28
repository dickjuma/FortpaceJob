import React from "react";

const SortBar = ({ onSortChange, currentSort = "rating" }) => {
  const sortOptions = [
    { value: "rating", label: "Top Rated" },
    { value: "reviews", label: "Most Reviews" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "relevance", label: "Relevance" }
  ];

  const handleSortChange = (e) => {
    onSortChange?.(e.target.value);
  };

  return (
    <div className="sort-bar" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
      padding: "12px 16px",
      background: "#fff",
      borderRadius: "12px",
      border: "1px solid var(--stroke)"
    }}>
      <span style={{ color: "var(--ink-60)", fontSize: "0.9rem" }}>
        Sort by:
      </span>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange?.(option.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "none",
              background: currentSort === option.value ? "var(--cta)" : "var(--accent1)",
              color: currentSort === option.value ? "#fff" : "var(--primary)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              transition: "all 0.2s ease"
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortBar;
