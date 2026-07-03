import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const Contact = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from("site_settings")
      .select("full_name, email, linkedin_url, github_url, twitter_url, location, cv_url")
      .eq("id", 1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const email = settings?.email || "osita.odo@gmail.com";
  const staticCv = `${import.meta.env.BASE_URL}cv/Odo_CV_Cybersec..pdf`;
  const cvUrl = settings?.cv_url || staticCv;

  return (
    <section className="portfolio-shell">
      <div className="contact-card">
        <p className="eyebrow" style={{ color: "rgba(255,255,255,0.75)" }}>Get in Touch</p>
        <h2>Let&rsquo;s connect.</h2>
        <p>
          I am open to opportunities in cybersecurity, digital risk, privacy,
          and public-interest technology. Feel free to reach out — I would love to hear from you.
        </p>

        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <a className="btn contact-btn-primary"
            href={`mailto:${email}?subject=Portfolio%20Inquiry`}>
            <i className="bi bi-envelope-fill"></i> Email Me
          </a>
          <a className="btn contact-btn-secondary"
            href={cvUrl} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-file-earmark-person"></i> View CV
          </a>
          <a className="btn contact-btn-secondary"
            href={cvUrl} download="Odo_CV.pdf">
            <i className="bi bi-download"></i> Download CV
          </a>
        </div>

        {/* Social links */}
        {(settings?.linkedin_url || settings?.github_url || settings?.twitter_url) && (
          <div className="contact-socials">
            {settings.linkedin_url && (
              <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="contact-social-link" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            )}
            {settings.github_url && (
              <a href={settings.github_url} target="_blank" rel="noopener noreferrer"
                className="contact-social-link" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
            )}
            {settings.twitter_url && (
              <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                className="contact-social-link" aria-label="Twitter / X">
                <i className="bi bi-twitter-x"></i>
              </a>
            )}
          </div>
        )}

        {settings?.location && (
          <p className="contact-location">
            <i className="bi bi-geo-alt"></i> {settings.location}
          </p>
        )}
      </div>
    </section>
  );
};
