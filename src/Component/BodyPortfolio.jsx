import img1 from "../image/img-1.jpeg"

export const BodyPortfolio = () => {
  return (
    <main id="home" className="portfolio-shell">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Cybersecurity | Governance | Risk Awareness</p>
          <h2>
            I help organisations protect people, data, and digital trust.
          </h2>
          <p className="hero-text">
            I am Osita Kingsley Odo, a Junior Cybersecurity Analyst with a strong foundation in
            vulnerability assessment, privacy compliance, and security operations. My work sits at
            the intersection of technical analysis and responsible, people-centered protection.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#experience">View Experience</a>
            <a className="btn secondary" href="#contact">Get in Touch</a>
          </div>
          <div className="hero-highlights">
            <div>
              <strong>500+</strong>
              <span>Account compromise awareness cases</span>
            </div>
            <div>
              <strong>GDPR</strong>
              <span>Privacy and compliance focus</span>
            </div>
            <div>
              <strong>OWASP</strong>
              <span>Web app vulnerability assessment</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img src={img1} alt="Osita Kingsley Odo portrait" />
        </div>
      </section>

      <section id="experience" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Professional Experience</p>
          <h3>Building secure, resilient digital environments.</h3>
        </div>

        <div className="card-grid">
          <article className="info-card">
            <div className="card-icon">🛡️</div>
            <h3>Compliance and Data Security</h3>
            <p className="card-company">Qarba Properties, Nigeria</p>
            <ul className="detail-list">
              <li>Led data privacy reviews aligned with GDPR, NDPA, and ISO/IEC 27001.</li>
              <li>Performed OWASP ZAP assessments for authentication, authorization, and accounting weaknesses.</li>
              <li>Supported remediation plans that strengthened web application security posture.</li>
            </ul>
          </article>

          <article className="info-card">
            <div className="card-icon">🎤</div>
            <h3>Stage Manager (Volunteer)</h3>
            <p className="card-company">TEDxBerlin: A World With AI, Berlin</p>
            <ul className="detail-list">
              <li>Coordinated stage operations and speaker transitions for live sessions.</li>
              <li>Managed timing, logistics, and team communication under pressure.</li>
              <li>Worked collaboratively with speakers, crew, and event producers.</li>
            </ul>
          </article>

          <article className="info-card">
            <div className="card-icon">🚨</div>
            <h3>Incident Response Team Member</h3>
            <p className="card-company">ANCA 7th Meeting – Geneva Cyberweek 2026</p>
            <ul className="detail-list">
              <li>Contributed to detection, containment, eradication, and recovery phases.</li>
              <li>Supported coordinated crisis response across technical and policy stakeholders.</li>
              <li>Helped strengthen decision-making in complex cyber incident scenarios.</li>
            </ul>
          </article>

          <article className="info-card">
            <div className="card-icon">📊</div>
            <h3>Research and Advocacy Fellow</h3>
            <p className="card-company">Center for Migration, Gender and Justice, Germany</p>
            <ul className="detail-list">
              <li>Conducted data mapping and analysis across migration policy ecosystems.</li>
              <li>Represented the organisation in international policy discussions.</li>
              <li>Assessed gender inclusion and data relevance in migration frameworks.</li>
            </ul>
          </article>

          <article className="info-card">
            <div className="card-icon">💻</div>
            <h3>IT Support Manager</h3>
            <p className="card-company">Department of Sociology and Anthropology, UNN</p>
            <ul className="detail-list">
              <li>Managed IT setup for seminars, presentations, and academic events.</li>
              <li>Ensured stable audiovisual and technical support for departmental activities.</li>
              <li>Delivered reliable support in fast-paced academic settings.</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="education" className="section-block alt-bg">
        <div className="section-heading">
          <p className="eyebrow">Education and Training</p>
          <h3>Continuous learning across technology, policy, and leadership.</h3>
        </div>

        <div className="edu-grid">
          <article className="info-card">
            <h3>IT and Cybersecurity</h3>
            <p><strong>IT Infrastructure Foundation</strong> | ReDi School of Digital Integration</p>
            <p>Networking, cloud, and workplace fundamentals including Windows, Azure AD, and Office 365.</p>
            <p><strong>Cyber Security School</strong> | Southern Africa-Netherlands Cyber Security School</p>
          </article>

          <article className="info-card">
            <h3>University Education</h3>
            <p><strong>MSc Social Protection</strong> | Hochschule Bonn-Rhein-Sieg</p>
            <p><strong>Erasmus MA Humanitarian Action</strong> | Ruhr University Bochum and University of Groningen</p>
          </article>

          <article className="info-card">
            <h3>Professional Certificates</h3>
            <p><strong>Google Cybersecurity Professional Certificate</strong></p>
            <p><strong>Advanced Diploma in AI in Business</strong> | Tekidia Institute</p>
            <p><strong>Technical Support Fundamentals</strong> | Google</p>
          </article>
        </div>
      </section>

      <section id="skills" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Technical Skills</p>
          <h3>Security, analysis, and communication in one profile.</h3>
        </div>

        <div className="skills-grid">
          <article className="info-card">
            <h3>Security Tools</h3>
            <div className="tag-group">
              <span className="tag">VirusTotal</span>
              <span className="tag">OWASP ZAP</span>
              <span className="tag">Wireshark</span>
              <span className="tag">Nmap</span>
              <span className="tag">SPLUNK</span>
              <span className="tag">Burp Suite</span>
              <span className="tag">Caido</span>
            </div>
          </article>

          <article className="info-card">
            <h3>Technical Strengths</h3>
            <div className="tag-group">
              <span className="tag">Python</span>
              <span className="tag">Linux/Kali</span>
              <span className="tag">SQL</span>
              <span className="tag">Cisco Packet Tracer</span>
              <span className="tag">EVE-NG</span>
            </div>
          </article>

          <article className="info-card">
            <h3>Languages and Leadership</h3>
            <p><strong>English:</strong> C1 – Advanced</p>
            <p><strong>German:</strong> B1 – Intermediate</p>
            <p>Leadership experience through student representation, volunteer coordination, and team-based initiatives.</p>
          </article>
        </div>
      </section>

      <section id="contact" className="section-block contact-card">
        <h2>Let’s connect.</h2>
        <p>
          I am open to opportunities in cybersecurity, digital risk, privacy, and public-interest technology.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="mailto:osita.odo@gmail.com?subject=Portfolio%20Inquiry">Email Me</a>
          <a className="btn secondary" href="/cv/Odo_CV_Cybersec..pdf" target="_blank" rel="noopener noreferrer">View CV</a>
          <a className="btn secondary" href="/cv/Odo_CV_Cybersec..pdf" download="Odo_CV_Cybersec.pdf">Download CV</a>
        </div>
      </section>
    </main>
  )
}