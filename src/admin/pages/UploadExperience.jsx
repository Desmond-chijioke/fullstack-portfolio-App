import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const ICONS = [
  "🛡️", "💻", "🔒", "📊", "🚨", "🎤", "🌐", "📋", "🔍", "⚙️",
  "📡", "🏛️", "🎓", "💼", "🤝", "📝", "🔧", "🌍", "🧩", "✅",
];

const emptyForm = {
  title: "",
  company: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  role_type: "professional", // professional | volunteer | fellowship
  icon: "🛡️",
  bullet_1: "",
  bullet_2: "",
  bullet_3: "",
  bullet_4: "",
};

export const UploadExperience = () => {
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
    const fetchExperience = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError("Failed to load experience.");
      } else {
        const bullets = data.bullets || [];
        setForm({
          ...emptyForm,
          ...data,
          bullet_1: bullets[0] || "",
          bullet_2: bullets[1] || "",
          bullet_3: bullets[2] || "",
          bullet_4: bullets[3] || "",
        });
      }
      setFetching(false);
    };
    fetchExperience();
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const bullets = [
      form.bullet_1,
      form.bullet_2,
      form.bullet_3,
      form.bullet_4,
    ].filter(Boolean);

    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      start_date: form.start_date || null,
      end_date: form.is_current ? null : form.end_date || null,
      is_current: form.is_current,
      role_type: form.role_type,
      icon: form.icon,
      bullets,
    };

    let result;
    if (isEdit) {
      result = await supabase
        .from("experiences")
        .update(payload)
        .eq("id", id);
    } else {
      result = await supabase.from("experiences").insert([payload]);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(
        isEdit ? "Experience updated successfully!" : "Experience added!"
      );
      if (!isEdit) {
        setForm(emptyForm);
        setTimeout(() => navigate("/admin/experiences"), 1500);
      }
    }
  };

  if (fetching) {
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
          <h1 className="admin-page-title">
            {isEdit ? "Edit Experience" : "Add Experience"}
          </h1>
          <p className="admin-page-sub">
            {isEdit
              ? "Update the details below"
              : "Fill in the details to add a new experience to your portfolio"}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/experiences")}
          className="admin-btn admin-btn-ghost"
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        {error && (
          <div className="admin-alert admin-alert-error">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}
        {success && (
          <div className="admin-alert admin-alert-success">
            <i className="bi bi-check-circle-fill"></i> {success}
          </div>
        )}

        {/* Icon picker */}
        <div className="admin-field">
          <label>Icon</label>
          <div className="admin-icon-picker">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={
                  "admin-icon-btn" + (form.icon === icon ? " selected" : "")
                }
                onClick={() => setForm((f) => ({ ...f, icon }))}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Title & Company */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="title">Job Title / Role *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Compliance and Data Security Analyst"
              value={form.title}
              onChange={set("title")}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="company">Company / Organisation *</label>
            <input
              id="company"
              type="text"
              placeholder="e.g. Qarba Properties, Nigeria"
              value={form.company}
              onChange={set("company")}
              required
            />
          </div>
        </div>

        {/* Location & Role Type */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Berlin, Germany"
              value={form.location}
              onChange={set("location")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="role_type">Role Type</label>
            <select
              id="role_type"
              value={form.role_type}
              onChange={set("role_type")}
            >
              <option value="professional">Professional</option>
              <option value="volunteer">Volunteer</option>
              <option value="fellowship">Fellowship / Research</option>
              <option value="academic">Academic / IT Support</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="start_date">Start Date</label>
            <input
              id="start_date"
              type="month"
              value={form.start_date}
              onChange={set("start_date")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="end_date">End Date</label>
            <input
              id="end_date"
              type="month"
              value={form.end_date}
              onChange={set("end_date")}
              disabled={form.is_current}
            />
          </div>
        </div>

        <div className="admin-field admin-field-check">
          <label>
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={set("is_current")}
            />
            Currently working here
          </label>
        </div>

        {/* Bullet points */}
        <div className="admin-field-group">
          <label className="admin-group-label">
            Key Responsibilities / Achievements
          </label>
          <p className="admin-group-hint">
            Add up to 4 bullet points describing what you did in this role.
          </p>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="admin-field admin-bullet-field">
              <div className="admin-bullet-prefix">
                <i className="bi bi-dot"></i>
              </div>
              <input
                type="text"
                placeholder={`Bullet point ${n}${n === 1 ? " (required)" : " (optional)"}`}
                value={form[`bullet_${n}`]}
                onChange={set(`bullet_${n}`)}
                required={n === 1}
              />
            </div>
          ))}
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => navigate("/admin/experiences")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-upload"></i>
                {isEdit ? "Update Experience" : "Save Experience"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
