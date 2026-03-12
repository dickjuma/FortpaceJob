import React from "react";
import { Link } from "react-router-dom";

const Categories = ({ categories = [] }) => {
  // Default categories if none provided
  const defaultCategories = [
    { title: "Electrical Services", slug: "electrical", desc: "Wiring, installation, troubleshooting", badge: "Physical", count: 320 },
    { title: "Mechanical Services", slug: "mechanical", desc: "Repairs, maintenance, diagnostics", badge: "Physical", count: 280 },
    { title: "Auto Repair", slug: "auto-repair", desc: "Brakes, suspension, AC service", badge: "Physical", count: 190 },
    { title: "Home Services", slug: "home-services", desc: "Plumbing, carpentry, painting", badge: "Physical", count: 410 },
    { title: "Design & UX", slug: "design-ux", desc: "UI/UX, branding, product design", badge: "Online", count: 520 },
    { title: "Web & Dev", slug: "web-dev", desc: "Frontend, backend, full-stack", badge: "Online", count: 760 }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="talent-section">
      <div className="section-header">
        <h2>Browse by category</h2>
        <p>Start with a category and filter down to the right expert.</p>
      </div>
      <div className="category-grid">
        {displayCategories.map((cat) => (
          <div key={cat.slug} className="category-card">
            <span className={`badge ${cat.badge === "Physical" ? "badge-physical" : "badge-online"}`}>
              {cat.badge}
            </span>
            <h3>{cat.title}</h3>
            <p>{cat.desc}</p>
            <div className="category-meta">
              <span>{cat.count} pros</span>
              <Link className="link-btn" to={`/talent/categories/${cat.slug}`}>
                View talent
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
