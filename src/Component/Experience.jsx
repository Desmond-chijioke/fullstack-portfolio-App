import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Pagination } from "./Pagination";

const PER_PAGE = 8;

const STATIC_EXPERIENCES = [
  {
    id: "static-1", icon: "🛡️",
    title: "Compliance and Data Security",
    company: "Qarba Properties, Nigeria",
    bullets: [
      "Led data privacy reviews aligned with GDPR, NDPA, and ISO/IEC 27001.",
      "Performed OWASP ZAP assessments for authentication, authorization, and accounting weaknesses.",
      "Supported remediation plans that strengthened web application security posture.",
    ],
  },
  {
    id: "static-2", icon: "🎤",
    title: "Stage Manager (Volunteer)",
    company: "TEDxBerlin: A World With AI, Berlin",
    bullets: [
      "Coordinated stage operations and speaker transitions for live sessions.",
      "Managed timing, logistics, and team communication under pressure.",
      "Worked collaboratively with speakers, crew, and event producers.",
    ],
  },
  {
    id: "static-3", icon: "🚨",
    title: "Incident Response Team Member",
    company: "ANCA 7th Meeting – Geneva Cyberweek 2026",
    bullets: [
      "Contributed to detection, containment, eradication, and recovery phases.",
      "Supported coordinated crisis response across technical and policy stakeholders.",
      "Helped strengthen decision-making in complex cyber incident scenarios.",
    ],
  },
  {
    id: "static-4", icon: "📊",
    title: "Research and Advocacy Fellow",
    company: "Center for Migration, Gender and Justice, Germany",
    bullets: [
      "Conducted data mapping and analysis across migration policy ecosystems.",
      "Represented the organisation in international policy discussions.",
      "Assessed gender inclusion and data relevance in migration frameworks.",
    ],
  },
  {
    id: "static-5", icon: "💻",
    title: "IT Support Manager",
    company: "Department of Sociology and Anthropology, UNN",
    bullets: [
      "Managed IT setup for seminars, presentations, and academic events.",
      "Ensured stable audiovisual and technical support for departmental activities.",
      "Delivered reliable support in fast-paced academic settings.",
    ],
  },
];

export const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingStatic, setUsingStatic] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase
      .from("experiences")
      .select("id, icon, title, company, location, role_type, is_current, start_date, end_date, bullets")
      .order("sort_order").order("start_date", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setExperiences(STATIC_EXPERIENCES);
          setUsingStatic(true);
        } else {
          setExperiences(data);
          setUsingStatic(false);
        }
        setLoading(false);
      });
  }, []);

  // Reset to page 1 whenever data changes
  useEffect(() => { setPage(1); }, [experiences]);

  const formatDateRange = (exp) => {
    if (!exp.start_date && !exp.end_date) return null;
    const fmt = (d) =>
      new Date(d + "-01").toLocaleDateString("en-GB", { year: "numeric", month: "short" });
    const start = exp.start_date ? fmt(exp.start_date) : "";
    const end = exp.is_current ? "Present" : exp.end_date ? fmt(exp.end_date) : "";
    return [start, end].filter(Boolean).join(" – ");
  };

  const totalPages = Math.ceil(experiences.length / PER_PAGE);
  const paginated = experiences.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section-block portfolio-shell">
      <div className="section-heading">
        <p className="eyebrow">Professional Experience</p>
        <h3>Building secure, resilient digital environments.</h3>
      </div>

      {loading ? (
        <div className="card-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="info-card skeleton-card" style={{ minHeight: 200 }}></div>
          ))}
        </div>
      ) : (
        <>
          <div className="card-grid">
            {paginated.map((exp) => (
              <article className="info-card" key={exp.id}>
                <div className="card-icon">{exp.icon || "💼"}</div>
                <h3>{exp.title}</h3>
                <p className="card-company">{exp.company}</p>
                {!usingStatic && (
                  <div className="card-meta-row">
                    {exp.location && (
                      <span className="card-meta">
                        <i className="bi bi-geo-alt"></i> {exp.location}
                      </span>
                    )}
                    {formatDateRange(exp) && (
                      <span className="card-meta">
                        <i className="bi bi-calendar3"></i> {formatDateRange(exp)}
                      </span>
                    )}
                    {exp.role_type && (
                      <span className="card-meta">
                        <i className="bi bi-briefcase"></i> {exp.role_type}
                      </span>
                    )}
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="detail-list">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                {!usingStatic && exp.is_current && (
                  <span className="card-badge">Current</span>
                )}
              </article>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={handlePage}
            totalItems={experiences.length}
            perPage={PER_PAGE}
          />
        </>
      )}
    </section>
  );
};
