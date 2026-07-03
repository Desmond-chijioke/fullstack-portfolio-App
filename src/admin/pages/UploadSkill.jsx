import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const LEVEL_OPTIONS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];

const emptyForm = { category: "", name: "", level: "", sort_order: 0 };

export const UploadSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addAnother, setAddAnother] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    supabase.from("skills").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) setError("Failed to load.");
      else setForm({ ...emptyForm, ...data });
      setFetching(false);
    });
  }, [id, isEdit]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    const payload = {
      category: form.category,
      name: form.name,
      level: form.level || null,
      sort_order: Number(form.sort_order) || 0,
    };

    const result = isEdit
      ? await supabase.from("skills").update(payload).eq("id", id)
      : await supabase.from("skills").insert([payload]);

    setLoading(false);
    if (result.error) { setError(result.error.message); return; }

    if (isEdit) {
      setSuccess("Skill updated!");
    } else {
      setSuccess("Skill added!");
      if (addAnother) {
        setForm((f) => ({ ...emptyForm, category: f.category })); // keep category
      } else {
        setTimeout(() => navigate("/admin/skills"), 1200);
      }
    }
  };

  if (fetching) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? "Edit Skill" : "Add Skill"}</h1>
          <p className="admin-page-sub">Skills are grouped by category on the Skills page</p>
        </div>
        <button onClick={() => navigate("/admin/skills")} className="admin-btn admin-btn-ghost">
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        {error && <div className="admin-alert admin-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="admin-alert admin-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        <div className="admin-form-row">
          <div className="admin-field">
            <label>Category *</label>
            <input type="text" placeholder="e.g. Security Tools, Technical Strengths, Languages"
              value={form.category} onChange={set("category")} required list="skill-categories" />
            <datalist id="skill-categories">
              <option value="Security Tools" />
              <option value="Technical Strengths" />
              <option value="Languages & Leadership" />
              <option value="Frameworks & Standards" />
              <option value="Cloud & Infrastructure" />
            </datalist>
          </div>
          <div className="admin-field">
            <label>Skill Name *</label>
            <input type="text" placeholder="e.g. OWASP ZAP, Python, German B1"
              value={form.name} onChange={set("name")} required />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-field">
            <label>Proficiency Level (optional)</label>
            <select value={form.level} onChange={set("level")}>
              {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l || "— Not specified —"}</option>)}
            </select>
          </div>
          <div className="admin-field" style={{ maxWidth: 140 }}>
            <label>Sort Order</label>
            <input type="number" value={form.sort_order} onChange={set("sort_order")} min={0} />
          </div>
        </div>

        {!isEdit && (
          <div className="admin-field admin-field-check">
            <label>
              <input type="checkbox" checked={addAnother} onChange={(e) => setAddAnother(e.target.checked)} />
              Add another skill after saving
            </label>
          </div>
        )}

        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => navigate("/admin/skills")}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? <><span className="admin-spinner"></span> Saving…</> : <><i className="bi bi-cloud-upload"></i> {isEdit ? "Update" : "Save Skill"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};
