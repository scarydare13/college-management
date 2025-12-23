import { useState } from "react";
import {
  GraduationCap,
  Info,
  BookOpen,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";

function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const links = [
    { id: "home", label: "Home", icon: <Info size={18} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
  ];

  const handleClick = (id) => {
    // Always go back to home before scrolling
    setActiveTab("home");
    setOpen(false);

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo" onClick={() => handleClick("home")}>
          <GraduationCap size={32} />
          <span>AIHT</span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links">
          {links.map((l) => (
            <button
              key={l.id}
              className={`nav-btn ${
                activeTab === l.id || (activeTab !== "home" && l.id === "home")
                  ? "active"
                  : ""
              }`}
              onClick={() => handleClick(l.id)}
            >
              {l.icon}
              {l.label}
            </button>
          ))}

        

          {user ? (
            <button className="auth-btn logout" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button
              className="auth-btn login"
              onClick={() => setActiveTab("login")}
            >
              <User size={16} /> Login
            </button>
          )}
        </div>

        {/* Mobile menu icon */}
        <div className="menu-icon" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          {links.map((l) => (
            <button key={l.id} onClick={() => handleClick(l.id)}>
              {l.label}
            </button>
          ))}

         
          {!user && (
            <button
              className="mobile-login"
              onClick={() => {
                setActiveTab("login");
                setOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
