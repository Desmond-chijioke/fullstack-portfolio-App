import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from("site_settings")
      .select("full_name, headline, email, linkedin_url, github_url, twitter_url, footer_tagline")
      .eq("id", 1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const year = new Date().getFullYear();
  const name = settings?.full_name || "Osita Kingsley Odo";
  const tagline = settings?.footer_tagline || "Building digital trust — one layer at a time.";
  const email = settings?.email || "osita.odo@gmail.com";

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand + tagline */}
        <div className="footer-brand">
          <Link to="/" className="footer-name">{name}</Link>
          <p className="footer-tagline">{tagline}</p>
        </div>

        {/* Nav */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/events">Events</Link>
          <Link to="/education">Education</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Social */}
        <div className="footer-social">
          {settings?.linkedin_url && (
            <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          )}
          {settings?.github_url && (
            <a href={settings.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="bi bi-github"></i>
            </a>
          )}
          {settings?.twitter_url && (
            <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <i className="bi bi-twitter-x"></i>
            </a>
          )}
          <a href={`mailto:${email}`} aria-label="Email">
            <i className="bi bi-envelope-fill"></i>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {year} {name}. All rights reserved.</p>
      </div>
    </footer>
  );
};
