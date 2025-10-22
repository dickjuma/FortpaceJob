import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../Assets/Coloredlogo.jpg"

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
     
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={Logo} alt="Fortspace Logo" className="nav-logo" />
        <h2 className="nav-brand">
          Fortespace<span className="highlight">Jobs</span>
        </h2>
      </div>

    
      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-item">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/jobs" className="nav-item">
            Find Jobs
          </NavLink>
        </li>
        <li>
          <NavLink to="/apply" className="nav-item">
            Apply
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-item">
            Contact
          </NavLink>
        </li>
        <li>
            <NavLink className="nav-item">
                Get-Started
            </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
