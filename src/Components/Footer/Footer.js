import React from "react";
import Logo from "../../Assets/logo.png";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-secondary)] text-[var(--color-primary)] p-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
        {/* ---- About Section ---- */}
        <div className="lg:col-span-1">
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
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-3">
            <li>
              <NavLink to='/about'>About us</NavLink>
            </li>
            <li>
              <a href="/">Contact us</a>
            </li>
            <li>
              <a href="/">Terms of Service</a>
            </li>
            <li>
              <a href="/">FAQs / Help & support</a>
            </li>
            <li>
              <a href="/">Trust, Safety & Security</a>
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
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex  items-center gap-2 mt-4">
          <Instagram size={16} />
          <Facebook size={16}/>
          <Twitter size={16}/>
          <Linkedin size={16}/>
        </div>
        <p>© {new Date().getFullYear()} Fortspace Jobs — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
