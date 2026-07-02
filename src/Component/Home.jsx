
import { Link } from "react-router-dom";
import img1 from "../image/img-1.jpeg"

export const Home = () => {
  return (
    <main id="home" className="portfolio-shell">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Cybersecurity • Governance • Privacy</p>
          <h3>I help organisations strengthen resilience, protect data, and build digital trust.</h3>
          <p className="hero-text">
            I am Osita Kingsley Odo, a junior cybersecurity professional with a strong foundation in
            vulnerability assessment, privacy awareness, and practical security operations. My work
            focuses on translating technical insight into clear, responsible protection strategies.
          </p>
          <div className="hero-actions">

            <Link className="btn primary" to="/experience">
               View Experience
            </Link>

              <a
                className="btn secondary"
                 href="/cv/Odo_CV_Cybersec..pdf"
                target="_blank"
                 rel="noopener noreferrer"
                >
               View CV
             </a>

            <Link className="btn secondary" to="/contact">
              Get in Touch
            </Link>
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
          <img src={img1} alt="Osita Kingsley Odo portrait" />
        </div>
      </section>
    </main>
  )
}