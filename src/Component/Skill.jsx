import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Pagination } from "./Pagination";

const PER_PAGE = 8;

export const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase
      .from("skills")
      .select("id, category, name, level")
      .order("category").order("sort_order").order("name")
      .then(({ data }) => {
        setSkills(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { setPage(1); }, [skills]);

  // Group all skills by category first, then paginate the cards
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  // Each category = 1 card; paginate the category cards
  const categories = Object.entries(grouped);
  const totalPages = Math.ceil(categories.length / PER_PAGE);
  const paginatedCategories = categories.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section-block portfolio-shell">
      <div className="section-heading">
        <p className="eyebrow">Technical Skills</p>
        <h3>Security, analysis, and communication in one profile.</h3>
      </div>

      {loading ? (
        <div className="skills-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="info-card skeleton-card" style={{ minHeight: 160 }}></div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="empty-state"><p>Skills coming soon.</p></div>
      ) : (
        <>
          <div className="skills-grid">
            {paginatedCategories.map(([category, items]) => (
              <article className="info-card" key={category}>
                <div className="card-icon">
                  {category.toLowerCase().includes("security") ? "🛡️"
                    : category.toLowerCase().includes("language") ? "🌍"
                    : category.toLowerCase().includes("cloud") ? "☁️"
                    : category.toLowerCase().includes("framework") ? "📐"
                    : "💻"}
                </div>
                <h3>{category}</h3>
                <div className="tag-group">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className={`tag${skill.level ? " tag-leveled" : ""}`}
                      title={skill.level || ""}
                    >
                      {skill.name}
                      {skill.level && (
                        <span className="tag-level">{skill.level[0]}</span>
                      )}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={handlePage}
            totalItems={categories.length}
            perPage={PER_PAGE}
          />
        </>
      )}
    </section>
  );
};
