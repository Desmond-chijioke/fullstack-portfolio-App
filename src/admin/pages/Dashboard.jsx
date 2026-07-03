import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const Dashboard = () => {
  const [counts, setCounts] = useState({ experiences: 0, events: 0, education: 0, skills: 0 });
  const [recent, setRecent] = useState({ experiences: [], events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [exp, evt, edu, ski, recentExp, recentEvt] = await Promise.all([
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("education").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("experiences").select("id, title, company").order("created_at", { ascending: false }).limit(4),
        supabase.from("events").select("id, title, city, event_date").order("created_at", { ascending: false }).limit(4),
      ]);
      setCounts({
        experiences: exp.count ?? 0,
        events: evt.count ?? 0,
        education: edu.count ?? 0,
        skills: ski.count ?? 0,
      });
      setRecent({ experiences: recentExp.data || [], events: recentEvt.data || [] });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;

  const statCards = [
    { label: "Experiences", value: counts.experiences, icon: "briefcase-fill", color: "", link: "/admin/experiences" },
    { label: "Events & Programs", value: counts.events, icon: "calendar-check-fill", color: "green", link: "/admin/events" },
    { label: "Education", value: counts.education, icon: "mortarboard-fill", color: "purple", link: "/admin/education" },
    { label: "Skills", value: counts.skills, icon: "tools", color: "orange", link: "/admin/skills" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Overview of all portfolio content</p>
        </div>
        <Link to="/admin/settings" className="admin-btn admin-btn-ghost">
          <i className="bi bi-gear"></i> Site Settings
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid admin-stats-grid-4">
        {statCards.map((s) => (
          <Link to={s.link} key={s.label} className={`admin-stat-card admin-stat-link`}>
            <div className={`admin-stat-icon${s.color ? ` admin-stat-icon-${s.color}` : ""}`}>
              <i className={`bi bi-${s.icon}`}></i>
            </div>
            <div>
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-quick-actions">
        <Link to="/admin/experiences/new" className="admin-btn admin-btn-primary">
          <i className="bi bi-plus-lg"></i> Add Experience
        </Link>
        <Link to="/admin/events/new" className="admin-btn admin-btn-secondary">
          <i className="bi bi-plus-lg"></i> Add Event
        </Link>
        <Link to="/admin/education/new" className="admin-btn admin-btn-secondary">
          <i className="bi bi-plus-lg"></i> Add Education
        </Link>
        <Link to="/admin/skills/new" className="admin-btn admin-btn-secondary">
          <i className="bi bi-plus-lg"></i> Add Skill
        </Link>
      </div>

      {/* Recent */}
      <div className="admin-two-col">
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Recent Experiences</h2>
            <Link to="/admin/experiences" className="admin-link">View all</Link>
          </div>
          {recent.experiences.length === 0 ? <p className="admin-empty">None yet.</p> : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Company</th></tr></thead>
              <tbody>
                {recent.experiences.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td><td>{e.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2>Recent Events</h2>
            <Link to="/admin/events" className="admin-link">View all</Link>
          </div>
          {recent.events.length === 0 ? <p className="admin-empty">None yet.</p> : (
            <table className="admin-table">
              <thead><tr><th>Title</th><th>City</th></tr></thead>
              <tbody>
                {recent.events.map((e) => (
                  <tr key={e.id}>
                    <td>{e.title}</td><td>{e.city || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
