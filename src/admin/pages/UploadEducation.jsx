import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ImageUpload } from "../components/ImageUpload";

const ICONS = ["🎓","🏛️","📜","🎖️","📚","💡","🔬","🌍","🤝","✅","📋","🎤","🏆","💼","🔧"];

const emptyForm = {
  category: "",
  institution: "",
  degree: "",
  field: "",
  start_year: "",
  end_year: "",
  is_current: false,
  description: "",
  icon: "🎓",
  logo_url: "",
  cert_url: "",
  sort_order: 0,
};

export const UploadEducation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    supabase.from("education").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) setError("Failed to load.");
      else setForm({ ...emptyForm, ...data });
      setFetching(false);
    });
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    const payload = {
      category: form.category,
      institution: form.institution,
      degree: form.degree,
      field: form.field,
      start_year: form.start_year,
      end_year: form.is_current ? null : form.end_year,
      is_current: form.is_current,
      description: form.description,
      icon: form.icon,
      logo_url: form.logo_url || null,
      cert_url: form.cert_url || null,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = isEdit
      ? await supabase.from("education").update(payload).eq("id", id)
      : await supabase.from("education").insert([payload]);

    setLoading(false);
    if (result.error) { setError(result.error.message); return; }
    setSuccess(isEdit ? "Updated!" : "Education added!");
    if (!isEdit) { setForm(emptyForm); setTimeout(() => navigate("/admin/education"), 1200); }
  };

  if (fetching) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? "Edit Education" : "Add Education"}</h1>
          <p className="admin-page-sub">Degrees, courses, and professional certificates</p>
        </div>
        <button onClick={() => navigate("/admin/education")} className="admin-btn admin-btn-ghost">
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        {error && <div className="admin-alert admin-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="admin-alert admin-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        {/* Icon picker */}
        <div className="admin-field">
          <label>Icon</label>
          <div className="admin-icon-picker">
            {ICONS.map((icon) => (
              <button key={icon} type="button"
                className={"admin-icon-btn" + (form.icon === icon ? " selected" : "")}
                onClick={() => setForm((f) => ({ ...f, icon }))}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-field">
            <label>Category *</label>
            <select value={form.category} onChange={set("category")} required>
              <option value="">— Select —</option>
              <option value="IT & Cybersecurity">IT & Cybersecurity</option>
              <option value="University Education">University Education</option>
              <option value="Professional Certificate">Professional Certificate</option>
              <option value="Training & Workshop">Training & Workshop</option>
              <option value="Online Course">Online Course</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="admin-field">
            <label>Institution / Provider *</label>
            <input type="text" placeholder="e.g. ReDi School of Digital Integration"
              value={form.institution} onChange={set("institution")} required />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-field">
            <label>Degree / Programme Title</label>
            <input type="text" placeholder="e.g. MSc Social Protection"
              value={form.degree} onChange={set("degree")} />
          </div>
          <div className="admin-field">
            <label>Field of Study</label>
            <input type="text" placeholder="e.g. Cybersecurity, Humanitarian Action"
              value={form.field} onChange={set("field")} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-field">
            <label>Start Year</label>
            <input type="text" placeholder="2022" value={form.start_year} onChange={set("start_year")} />
          </div>
          <div className="admin-field">
            <label>End Year</label>
            <input type="text" placeholder="2024" value={form.end_year} onChange={set("end_year")} disabled={form.is_current} />
          </div>
        </div>

        <div className="admin-field admin-field-check">
          <label>
            <input type="checkbox" checked={form.is_current} onChange={set("is_current")} />
            Currently studying / in progress
          </label>
        </div>

        <div className="admin-field">
          <label>Description</label>
          <textarea rows={3} placeholder="Brief description of what you studied or gained…"
            value={form.description} onChange={set("description")} />
        </div>

        <ImageUpload
          value={form.logo_url}
          onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
          folder="education"
          label="Institution Logo (optional)"
          hint="Small logo or badge image. JPG, PNG or WebP."
        />

        <div className="admin-field">
          <label>Certificate / Badge URL (optional)</label>
          <input type="url" placeholder="https://..." value={form.cert_url} onChange={set("cert_url")} />
        </div>

        <div className="admin-field" style={{ maxWidth: 120 }}>
          <label>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={set("sort_order")} min={0} />
        </div>

        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate("/admin/education")}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? <><span className="admin-spinner"></span> Saving…</> : <><i className="bi bi-cloud-upload"></i> {isEdit ? "Update" : "Save"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};
