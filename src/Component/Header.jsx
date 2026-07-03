import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import fallbackAvatar from "../image/img-2.jpeg";

export const Header = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from("site_settings").select("full_name, headline, avatar_url").eq("id", 1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const avatar = settings?.avatar_url || fallbackAvatar;
  const name = settings?.full_name || "Osita Kingsley Odo";
  const headline = settings?.headline || "Cybersecurity Analyst • Risk & Privacy";

  return (
    <header className="site-header">
      <div className="header">
        <Link className="brand" to="/">
          <img src={avatar} alt={name} />
          <div className="brand-copy">
            <strong>{name}</strong>
            <span>{headline}</span>
          </div>
        </Link>

        <nav className="navbar">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/experience">Experience</Link>
          <Link className="nav-link" to="/events">Events</Link>
          <Link className="nav-link" to="/education">Education</Link>
          <Link className="nav-link" to="/skills">Skills</Link>
          <Link className="nav-link primary" to="/contact">Contact</Link>
          {/* <Link className="nav-link admin-nav-btn" to="/admin" title="Admin">
            <i className="bi bi-shield-lock"></i>
          </Link> */}
        </nav>
      </div>
    </header>
  );
};
