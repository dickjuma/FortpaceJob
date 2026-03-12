import React from "react";
import { Link, useParams } from "react-router-dom";
import { categories, talents } from "./data";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const filteredTalents = talents.filter((talent) => talent.category === slug);

  if (!category) {
    return (
      <div className="talent-page">
        <section className="talent-section">
          <div className="section-header">
            <h2>Category not found</h2>
            <p>We could not locate that category. Browse all talent instead.</p>
          </div>
          <Link className="ghost" to="/talent">Back to Hire Talent</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="talent-page">
      <section className="category-hero">
        <div>
          <p className="eyebrow">{category.badge} services</p>
          <h1>{category.title}</h1>
          <p className="subhead">{category.desc}</p>
          <div className="category-meta-line">
            <span>{category.count} verified pros</span>
            <span>Response time under 2 hours</span>
            <span>Flexible hiring models</span>
          </div>
        </div>
        <div className="category-actions">
          <Link className="hire-btn" to={`/talent/request?category=${category.slug}`}>Post a request</Link>
          <Link className="ghost" to="/talent">Browse all categories</Link>
        </div>
      </section>

      <section className="talent-section">
        <div className="section-header">
          <h2>Available experts</h2>
          <p>Shortlist and reach out to the right professional in minutes.</p>
        </div>
        {filteredTalents.length === 0 ? (
          <div className="empty-state">
            <h3>No profiles yet</h3>
            <p>Be the first to post a request in this category.</p>
            <Link className="cta-btn" to={`/talent/request?category=${category.slug}`}>Post a job</Link>
          </div>
        ) : (
          <div className="talent-grid">
            {filteredTalents.map((talent) => (
              <div key={talent.id} className="talent-card">
                <div className="talent-header">
                  <div>
                    <h3>{talent.name}</h3>
                    <p>{talent.title}</p>
                  </div>
                  <span className="badge badge-cta">{talent.badge}</span>
                </div>
                <div className="talent-meta">
                  <span>Rating {talent.rating}/5</span>
                  <span>({talent.reviews} reviews)</span>
                  <span>{talent.location}</span>
                </div>
                <div className="talent-tags">
                  {talent.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="talent-footer">
                  <strong>{talent.price}</strong>
                  <div className="talent-actions">
                    <Link to={`/talent/${talent.id}`} className="ghost">View profile</Link>
                    <Link to={`/talent/request?talent=${talent.id}`} className="hire-btn">Hire now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
