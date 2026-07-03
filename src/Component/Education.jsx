import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Pagination } from "./Pagination";

const PER_PAGE = 8;

const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key] || "Other";
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

export const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase
      .from("education")
      .select("id, icon, category, institution, degree, field, start_year, end_year, is_current, description, logo_url, cert_url")
      .order("sort_order").order("created_at", { ascending: false })
      .then(({ data }) => {
        setEducation(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { setPage(1); }, [education]);

  const formatPeriod = (edu) => {
    const parts = [edu.start_year, edu.is_current ? "Present" : edu.end_year].filter(Boolean);
    return parts.join(" – ");
  };

  const totalPages = Math.ceil(education.length / PER_PAGE);
  const paginated = education.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const grouped = groupBy(paginated, "category");

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section-block portfolio-shell">
      <div className="section-heading">
        <p className="eyebrow">Education & Training</p>
        <h3>Continuous learning across technology, policy, and leadership.</h3>
      </div>

      {loading ? (
        <div className="card-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="info-card skeleton-card" style={{ minHeight: 180 }}></div>
          ))}
        </div>
      ) : education.length === 0 ? (
        <div className="empty-state">
          <p>Education records coming soon.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "1.5rem" }}>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="edu-category-label">{category}</p>
                <div className="card-grid">
                  {items.map((edu) => (
                    <article className="info-card" key={edu.id}>
                      <div className="edu-card-top">
                        <div className="card-icon">{edu.icon || "🎓"}</div>
                        {edu.logo_url && (
                          <img src={edu.logo_url} alt={edu.institution} className="edu-logo" />
                        )}
                      </div>
                      <h3>{edu.degree || edu.institution}</h3>
                      <p className="card-company">{edu.institution}</p>
                      {edu.field && <p className="card-desc">{edu.field}</p>}
                      {formatPeriod(edu) && (
                        <span className="card-meta">
                          <i className="bi bi-calendar3"></i> {formatPeriod(edu)}
                          {edu.is_current && (
                            <span className="card-badge" style={{ marginLeft: "0.5rem" }}>In Progress</span>
                          )}
                        </span>
                      )}
                      {edu.description && (
                        <p className="card-desc" style={{ marginTop: "0.5rem" }}>{edu.description}</p>
                      )}
                      {edu.cert_url && (
                        <a href={edu.cert_url} target="_blank" rel="noopener noreferrer" className="card-cert-link">
                          <i className="bi bi-patch-check-fill"></i> View Certificate
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={handlePage}
            totalItems={education.length}
            perPage={PER_PAGE}
          />
        </>
      )}
    </section>
  );
};
