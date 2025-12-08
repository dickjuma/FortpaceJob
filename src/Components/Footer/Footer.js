import React from "react";
import Logo from "../../Assets/logo.png";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-secondary)] text-[var(--color-primary)] p-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        {/* ---- About Section ---- */}
        <div className="footer-section about">
          <img
            src={Logo}
            alt="Fortspace Logo"
            className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto"
          />
        </div>

        {/* ---- Quick Links ---- */}

        <div>
          <p className="text-lg ">FOR CLIENTS</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/">How to Hire</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg">FOR TALENT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/">How to to find work</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="/">About us</a>
            </li>
            <li>
              <a href="/">Contact us</a>
            </li>
            <li>
              <a href="/">Terms of Service</a>
            </li>
            <li>
              <a href="/">FAQs / Help $ support</a>
            </li>
            <li>
              <a href="/">Trust, Safety $ Security</a>
            </li>
            <li>
              <a href="/">Impact</a>
            </li>
            <li>
              <a href="/">Privacy Policy</a>
            </li>
            <li>
              <a href="/">Careers</a>
            </li>
            <li>
              <a href="/">Affiliates</a>
            </li>
            <li>
              <a href="/">Investor Relations</a>
            </li>
          </ul>
        </div>
      </div>

      {/* ---- Bottom Line ---- */}
      <hr className='border-gray-300 mt-8' />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mt-4">
          <Instagram className="w-6 h-6" />
          <Facebook className="w-6 h-6"/>
          <Twitter className="w-6 h-6"/>
          <Linkedin className="w-6 h-6"/>
        </div>
        <p>© {new Date().getFullYear()} Fortspace Jobs — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
