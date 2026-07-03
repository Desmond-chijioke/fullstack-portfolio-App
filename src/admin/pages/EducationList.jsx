import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const EducationList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchAll = async () => {
    const { data } = await supabase
      .from("education")
      .select("id, icon, category, institution, degree, start_year, end_year, is_current")
      .order("sort_order").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education record?")) return;
    setDeleting(id);
    await supabase.from("education").delete().eq("id", id);
    setDeleting(null);
    fetchAll();
  };

  if (loading) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Education & Training</h1>
          <p className="admin-page-sub">{items.length} record(s)</p>
        </div>
        <Link to="/admin/education/new" className="admin-btn admin-btn-primary">
          <i className="bi bi-plus-lg"></i> Add Education
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-mortarboard"></i>
          <p>No education records yet.</p>
          <Link to="/admin/education/new" className="admin-btn admin-btn-primary">Add Education</Link>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table admin-table-full">
            <thead>
              <tr>
                <th></th>
                <th>Category</th>
                <th>Institution</th>
                <th>Degree / Programme</th>
                <th>Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((edu) => (
                <tr key={edu.id}>
                  <td style={{ fontSize: "1.2rem" }}>{edu.icon}</td>
                  <td><span className="admin-badge">{edu.category}</span></td>
                  <td><strong>{edu.institution}</strong></td>
                  <td>{edu.degree || "—"}</td>
                  <td>
                    {edu.start_year || ""}
                    {edu.start_year && (edu.end_year || edu.is_current) ? " – " : ""}
                    {edu.is_current ? <span className="admin-badge admin-badge-green">Current</span> : edu.end_year || ""}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/education/${edu.id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(edu.id)} disabled={deleting === edu.id}>
                        {deleting === edu.id ? <span className="admin-spinner"></span> : <i className="bi bi-trash"></i>}
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
