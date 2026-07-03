import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import fallbackImg from "../image/img-1.jpeg";

export const Home = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const s = settings;
  const heroImage = s?.hero_image_url || fallbackImg;
  const staticCv = `${import.meta.env.BASE_URL}cv/Odo_CV_Cybersec..pdf`;
  const cvUrl = s?.cv_url || staticCv;

  return (
    <main id="home" className="portfolio-shell">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">{s?.hero_tagline || "Cybersecurity • Governance • Privacy"}</p>
          <h1 className="hero-headline">
            {s?.hero_headline || "I help organisations strengthen resilience, protect data, and build digital trust."}
          </h1>
          <p className="hero-text">
            {s?.hero_bio || "I am a junior cybersecurity professional with a strong foundation in vulnerability assessment, privacy awareness, and practical security operations."}
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/experience">View Experience</Link>
            <a className="btn secondary" href={cvUrl} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-file-earmark-person"></i> View CV
            </a>
            <Link className="btn secondary" to="/contact">Get in Touch</Link>
          </div>
          <div className="hero-highlights">
            <div>
              <strong>Security Analysis</strong>
              <span>Vulnerability review and awareness support</span>
            </div>
            <div>
              <strong>Privacy Focus</strong>
              <span>GDPR-minded, compliance-aware practice</span>
            </div>
            <div>
              <strong>Operational Readiness</strong>
              <span>Prepared for response and resilience work</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt={s?.full_name || "Osita Kingsley Odo"} />
        </div>
      </section>
    </main>
  );
};
