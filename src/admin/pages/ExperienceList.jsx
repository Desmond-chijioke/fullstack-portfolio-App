import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const ExperienceList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("experiences")
      .select("id, title, company, location, role_type, is_current, start_date")
      .order("start_date", { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience? This cannot be undone."))
      return;
    setDeleting(id);
    await supabase.from("experiences").delete().eq("id", id);
    setDeleting(null);
    fetchAll();
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <span className="admin-spinner admin-spinner-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">All Experiences</h1>
          <p className="admin-page-sub">{items.length} experience(s) in your portfolio</p>
        </div>
        <Link to="/admin/experiences/new" className="admin-btn admin-btn-primary">
          <i className="bi bi-plus-lg"></i> Add Experience
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-briefcase"></i>
          <p>No experiences yet. Add your first one.</p>
          <Link to="/admin/experiences/new" className="admin-btn admin-btn-primary">
            Add Experience
          </Link>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table admin-table-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company / Organisation</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <strong>{exp.title}</strong>
                  </td>
                  <td>{exp.company}</td>
                  <td>{exp.location || "—"}</td>
                  <td>
                    <span className="admin-badge">{exp.role_type}</span>
                  </td>
                  <td>
                    {exp.is_current ? (
                      <span className="admin-badge admin-badge-green">Current</span>
                    ) : (
                      <span className="admin-badge admin-badge-gray">Past</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link
                        to={`/admin/experiences/${exp.id}/edit`}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(exp.id)}
                        disabled={deleting === exp.id}
                      >
                        {deleting === exp.id ? (
                          <span className="admin-spinner"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
