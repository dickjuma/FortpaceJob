import React from "react";
import { Link } from "react-router-dom";
import ProBadge from "./ProBadge";

const TalentCard = ({ talent }) => {
  if (!talent) return null;

  const {
    id,
    name,
    title,
    rating = 0,
    reviews = 0,
    location,
    price,
    tags = [],
    badge,
    _id,
    bio,
    level,
    avgRating,
    totalReviews,
    country,
    hourlyRate,
    currency = "$"
  } = talent;

  const talentId = id || _id;
  const displayName = name || "Anonymous";
  const displayTitle = title || bio?.substring(0, 50) || "Professional";
  const displayRating = avgRating || rating;
  const displayReviews = totalReviews || reviews;
  const displayLocation = country || location || "Remote";
  const displayPrice = hourlyRate ? `${currency}${hourlyRate}/hr` : price || "$0/hr";
  const displayBadge = level || badge || "New";
  const displayTags = (talent.skills || tags).slice(0, 4);

  return (
    <div className="talent-card">
      <div className="talent-header">
        <div>
          <h3>{displayName}</h3>
          <p>{displayTitle}</p>
        </div>
        <ProBadge badge={displayBadge} />
      </div>
      <div className="talent-meta">
        <span>Rating {displayRating}/5</span>
        <span>({displayReviews} reviews)</span>
        <span>{displayLocation}</span>
      </div>
      <div className="talent-tags">
        {displayTags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
      <div className="talent-footer">
        <strong>{displayPrice}</strong>
        <div className="talent-actions">
          <Link to={`/talent/${talentId}`} className="ghost">View profile</Link>
          <Link to={`/talent/request?talent=${talentId}`} className="hire-btn">Hire now</Link>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
