import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const TYPE_LABELS = {
  conference: "Conference",
  training: "Training",
  workshop: "Workshop",
  program: "Program",
  fellowship: "Fellowship",
  hackathon: "Hackathon / CTF",
  volunteering: "Volunteering",
};

export const EventList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, organiser, venue, city, country, event_type, event_date")
      .order("event_date", { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(id);
    await supabase.from("events").delete().eq("id", id);
    setDeleting(null);
    fetchAll();
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
    });
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
          <h1 className="admin-page-title">All Events & Programs</h1>
          <p className="admin-page-sub">
            {items.length} event(s) logged in your portfolio
          </p>
        </div>
        <Link to="/admin/events/new" className="admin-btn admin-btn-primary">
          <i className="bi bi-plus-lg"></i> Add Event
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty-state">
          <i className="bi bi-calendar3"></i>
          <p>No events or programs logged yet.</p>
          <Link to="/admin/events/new" className="admin-btn admin-btn-primary">
            Add Event
          </Link>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table admin-table-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Organiser</th>
                <th>Venue / City</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <strong>{evt.title}</strong>
                  </td>
                  <td>{evt.organiser || "—"}</td>
                  <td>
                    {[evt.venue, evt.city, evt.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </td>
                  <td>
                    <span className="admin-badge">
                      {TYPE_LABELS[evt.event_type] || evt.event_type}
                    </span>
                  </td>
                  <td>{formatDate(evt.event_date)}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link
                        to={`/admin/events/${evt.id}/edit`}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(evt.id)}
                        disabled={deleting === evt.id}
                      >
                        {deleting === evt.id ? (
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
