import React from "react";

const ProBadge = ({ badge = "New" }) => {
  // Define badge styles based on badge type
  const getBadgeStyle = () => {
    const badgeLower = badge.toLowerCase();
    
    switch (badgeLower) {
      case "top rated":
        return {
          background: "var(--cta)",
          color: "#fff"
        };
      case "pro":
        return {
          background: "#6366F1",
          color: "#fff"
        };
      case "verified":
        return {
          background: "var(--accent2)",
          color: "var(--primary)"
        };
      case "reliable":
        return {
          background: "#F59E0B",
          color: "#fff"
        };
      case "level 1":
      case "level 2":
      case "level 3":
        return {
          background: "#10B981",
          color: "#fff"
        };
      default:
        return {
          background: "var(--accent1)",
          color: "var(--primary)"
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <span 
      className="badge badge-cta" 
      style={{
        ...badgeStyle,
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: "700",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px"
      }}
    >
      {badge === "Verified" && (
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      )}
      {badge}
    </span>
  );
};

export default ProBadge;
