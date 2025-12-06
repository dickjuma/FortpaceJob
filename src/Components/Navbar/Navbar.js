import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import "./Navbar.css";
import Logo from "../../Assets/Coloredlogo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* ===== LEFT SECTION ===== */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={Logo} alt="Fortspace Logo" className="nav-logo" />
        <h2 className="nav-brand">
          Fortespace<span className="highlight">Jobs</span>
        </h2>
      </div>

      {/* ===== DESKTOP NAV LINKS ===== */}
      <ul className="nav-links">
        <li><NavLink to="/" className="nav-item">Home</NavLink></li>
        <li><NavLink to="/jobs" className="nav-item">Hire Talent</NavLink></li>
   
        <li><NavLink to="/contact" className="nav-item">Contact</NavLink></li>
        <li
          className="nav-item dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="dropdown-toggle">
            Explore <ChevronDown size={16} />
          </span>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li onClick={() => navigate("/categories")}>Categories</li>
              <li onClick={() => navigate("/talent")}>Top Talent</li>
              <li onClick={() => navigate("/insights")}>Insights</li>
               <li onClick={() => navigate("/Postedjobs")}>Jobs/Projects</li>
            </ul>
          )}
        </li>
      </ul>

      {/* ===== RIGHT SECTION ===== */}
      <div className="nav-right">
        <button className="sign-in" onClick={() => navigate("/signin")}>
          Sign In
        </button>
        <button className="join-btn" onClick={() => navigate("/signup")}>
          Join Now
        </button>
      </div>

      {/* ===== MOBILE MENU TOGGLE ===== */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/jobs" onClick={() => setMenuOpen(false)}>Find Jobs</NavLink>
          <NavLink to="/apply" onClick={() => setMenuOpen(false)}>Apply</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/talent" onClick={() => setMenuOpen(false)}>Top Talent</NavLink>
          <NavLink to="/insights" onClick={() => setMenuOpen(false)}>Insights</NavLink>

          <button
            className="join-btn"
            onClick={() => {
              navigate("/signup");
              setMenuOpen(false);
            }}
          >
            Join Now
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
