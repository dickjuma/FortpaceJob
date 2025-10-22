import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="classic-footer">
      <div className="footer-container">

        {/* ---- About Section ---- */}
        <div className="footer-section about">
          <h2 className="footer-logo">
            Forte space<span className="highlight">Jobs</span>
          </h2>
          <p>
            Empowering, Aspirational, Assuring, Vibrant, Youthful,
           Hip and Disruptive. We are not just a tool; we are the catalyst for personal 
           and financial transformation. We should also communicate authority and reliability.
            We are also here to challenge 'the norms' of work culture.
          </p>
        </div>

        {/* ---- Quick Links ---- */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/jobs">Find Jobs</a></li>
            <li><a href="/apply">Apply</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        {/* ---- Newsletter ---- */}
        <div className="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe for new job alerts and updates.</p>
          <div className="subscribe-input">
            <input type="email" placeholder="Your Email Address" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* ---- Socials ---- */}
        <div className="footer-section socials">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* ---- Bottom Line ---- */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Fortspace Jobs — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
