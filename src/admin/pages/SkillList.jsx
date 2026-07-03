import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const SkillList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchAll = async () => {
    const { data } = await supabase
      .from("skills")
      .select("id, category, name, level, sort_order")
      .order("category").order("sort_order").order("name");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    setDeleting(id);
    await supabase.from("skills").delete().eq("id", id);
    setDeleting(null);
    fetchAll();
  };

  // Group by category for display
  const grouped = items.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  if (loading) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-sub">{items.length} skill(s) across {Object.keys(grouped).length} category(s)</p>
        </div>
        <Link to="/admin/skills/new" className="admin-btn admin-btn-primary">
          <i className="bi bi-plus-lg"></i> Add Skill
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-tools"></i>
          <p>No skills added yet.</p>
          <Link to="/admin/skills/new" className="admin-btn admin-btn-primary">Add Skill</Link>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, skills]) => (
          <div key={cat} className="admin-table-card" style={{ marginBottom: "1rem" }}>
            <div className="admin-table-header">
              <h2>{cat}</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{skills.length} skill(s)</span>
            </div>
            <table className="admin-table admin-table-full">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td><strong>{skill.name}</strong></td>
                    <td>{skill.level ? <span className="admin-badge">{skill.level}</span> : "—"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link to={`/admin/skills/${skill.id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
                          onClick={() => handleDelete(skill.id)} disabled={deleting === skill.id}>
                          {deleting === skill.id ? <span className="admin-spinner"></span> : <i className="bi bi-trash"></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};
