import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import "./Navbar.css";
import Logo from "../../Assets/logo.png";
import { authAPI, getToken, getUser } from "../../Services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(() => getUser());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthenticated = Boolean(getToken() && user);

  const dashboardPath = useMemo(() => {
    if (user?.role === "freelancer") return "/find-work";
    if (user?.role === "client") return "/talent";
    return "/";
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    if (user.role === "client") return user.companyName || user.name || user.email || "Account";
    return user.name || user.email || "Account";
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setUser(getUser());
    setShowUserMenu(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncUser = () => setUser(getUser());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authAPI.logout();
      setUser(null);
      navigate("/signin");
    } finally {
      setIsLoggingOut(false);
      setShowUserMenu(false);
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={Logo} alt="Fortspace Logo" className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto" />
      </div>

      <ul className="nav-links">
        <li><NavLink to="/talent" className="nav-item">Hire Talent</NavLink></li>
        <li><NavLink to="/find-work/" className="nav-item">Find Work</NavLink></li>

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
        <li><NavLink to="/pricing" className="nav-item">Pricing</NavLink></li>
      </ul>

      <div className="nav-right">
        {!isAuthenticated ? (
          <>
            <button className="sign-in" onClick={() => navigate("/signin")}>
              Sign In
            </button>
            <button className="join-btn" onClick={() => navigate("/signup")}>
              Join Now
            </button>
          </>
        ) : (
          <>
            <button className="app-link-btn" onClick={() => navigate(dashboardPath)}>
              Dashboard
            </button>
            <button className="app-link-btn" onClick={() => navigate("/find-work/messages")}>
              Messages
            </button>
            <div
              className="user-menu"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className="user-chip" type="button">
                <span className="avatar-dot">{displayName?.slice(0, 1)?.toUpperCase() || "U"}</span>
                <span className="user-name">{displayName}</span>
                <ChevronDown size={15} />
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <button type="button" onClick={() => navigate(dashboardPath)}>My Dashboard</button>
                  <button type="button" onClick={() => navigate("/my-profile")}>My Profile</button>
                  <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/talent" onClick={() => setMenuOpen(false)}>Hire Talent</NavLink>
          <NavLink to="/find-work/" onClick={() => setMenuOpen(false)}>Find Work</NavLink>
          <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/insights" onClick={() => setMenuOpen(false)}>Insights</NavLink>

          {!isAuthenticated ? (
            <>
              <button
                className="sign-in mobile-auth-btn"
                onClick={() => {
                  navigate("/signin");
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button
                className="join-btn"
                onClick={() => {
                  navigate("/signup");
                  setMenuOpen(false);
                }}
              >
                Join Now
              </button>
            </>
          ) : (
            <>
              <button
                className="join-btn"
                onClick={() => {
                  navigate(dashboardPath);
                  setMenuOpen(false);
                }}
              >
                My Dashboard
              </button>
              <button className="mobile-signout" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
