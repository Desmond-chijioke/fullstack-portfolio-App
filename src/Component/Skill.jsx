
export const Skill = () => {
    return (
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
    )
  }