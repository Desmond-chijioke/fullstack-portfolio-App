import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ImageUpload } from "../components/ImageUpload";

const ICONS = [
  "🌐", "📊", "🎤", "🚨", "🏛️", "🎓", "🤝", "🌍", "📡", "💼",
  "📋", "🔍", "🛡️", "🔒", "⚙️", "🧩", "✅", "📝", "🔧", "🌱",
];

const emptyForm = {
  title: "",
  organiser: "",
  venue: "",
  city: "",
  country: "",
  event_date: "",
  end_date: "",
  event_type: "conference",
  icon: "🌐",
  description: "",
  role: "",
  bullet_1: "",
  bullet_2: "",
  bullet_3: "",
  bullet_4: "",
  certificate_url: "",
  image_url: "",
};

export const UploadEvent = () => {
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
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        setError("Failed to load event.");
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
    fetchEvent();
  }, [id, isEdit]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
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
      organiser: form.organiser,
      venue: form.venue,
      city: form.city,
      country: form.country,
      event_date: form.event_date || null,
      end_date: form.end_date || null,
      event_type: form.event_type,
      icon: form.icon,
      description: form.description,
      role: form.role,
      bullets,
      certificate_url: form.certificate_url || null,
      image_url: form.image_url || null,
    };

    let result;
    if (isEdit) {
      result = await supabase.from("events").update(payload).eq("id", id);
    } else {
      result = await supabase.from("events").insert([payload]);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(isEdit ? "Event updated!" : "Event / Program added!");
      if (!isEdit) {
        setForm(emptyForm);
        setTimeout(() => navigate("/admin/events"), 1500);
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
            {isEdit ? "Edit Event / Program" : "Add Event / Program"}
          </h1>
          <p className="admin-page-sub">
            Log conferences, workshops, training programs, and events you
            attended or participated in.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/events")}
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

        {/* Title and event type */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="title">Event / Program Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Geneva Cyberweek 2026 – ANCA 7th Meeting"
              value={form.title}
              onChange={set("title")}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="event_type">Type</label>
            <select
              id="event_type"
              value={form.event_type}
              onChange={set("event_type")}
            >
              <option value="conference">Conference / Summit</option>
              <option value="training">Training / Course</option>
              <option value="workshop">Workshop</option>
              <option value="program">Program / Initiative</option>
              <option value="fellowship">Fellowship</option>
              <option value="hackathon">Hackathon / CTF</option>
              <option value="volunteering">Volunteering</option>
            </select>
          </div>
        </div>

        {/* Organiser and role */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="organiser">Organiser</label>
            <input
              id="organiser"
              type="text"
              placeholder="e.g. United Nations / TEDxBerlin"
              value={form.organiser}
              onChange={set("organiser")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="role">Your Role / Capacity</label>
            <input
              id="role"
              type="text"
              placeholder="e.g. Participant, Speaker, Volunteer, Team Member"
              value={form.role}
              onChange={set("role")}
            />
          </div>
        </div>

        {/* Venue, city, country */}
        <div className="admin-form-row admin-form-row-3">
          <div className="admin-field">
            <label htmlFor="venue">Venue / Location Name</label>
            <input
              id="venue"
              type="text"
              placeholder="e.g. Palais des Nations"
              value={form.venue}
              onChange={set("venue")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              placeholder="e.g. Geneva"
              value={form.city}
              onChange={set("city")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="e.g. Switzerland"
              value={form.country}
              onChange={set("country")}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="event_date">Start Date</label>
            <input
              id="event_date"
              type="date"
              value={form.event_date}
              onChange={set("event_date")}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="end_date">End Date (leave blank for single day)</label>
            <input
              id="end_date"
              type="date"
              value={form.end_date}
              onChange={set("end_date")}
            />
          </div>
        </div>

        {/* Description */}
        <div className="admin-field">
          <label htmlFor="description">Brief Description</label>
          <textarea
            id="description"
            placeholder="What was this event about? What did you learn or contribute?"
            value={form.description}
            onChange={set("description")}
            rows={3}
          />
        </div>

        {/* Key takeaways / bullet points */}
        <div className="admin-field-group">
          <label className="admin-group-label">
            Key Contributions / Takeaways
          </label>
          <p className="admin-group-hint">
            Highlight what you contributed or gained from this event.
          </p>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="admin-field admin-bullet-field">
              <div className="admin-bullet-prefix">
                <i className="bi bi-dot"></i>
              </div>
              <input
                type="text"
                placeholder={`Point ${n}${n === 1 ? " (required)" : " (optional)"}`}
                value={form[`bullet_${n}`]}
                onChange={set(`bullet_${n}`)}
                required={n === 1}
              />
            </div>
          ))}
        </div>

        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          folder="events"
          label="Event / Program Photo (optional)"
          hint="A photo from the event, badge, or programme image."
        />

        {/* Certificate URL */}
        <div className="admin-field">
          <label htmlFor="certificate_url">
            Certificate / Badge URL (optional)
          </label>
          <input
            id="certificate_url"
            type="url"
            placeholder="https://..."
            value={form.certificate_url}
            onChange={set("certificate_url")}
          />
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={() => navigate("/admin/events")}
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
                {isEdit ? "Update Event" : "Save Event"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
