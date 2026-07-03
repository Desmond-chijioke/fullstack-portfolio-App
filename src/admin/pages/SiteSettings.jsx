import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ImageUpload } from "../components/ImageUpload";
import { uploadFile, deleteImage } from "../../lib/storage";

/* ── CV Upload widget ─────────────────────────────────────── */
const CvUpload = ({ onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large — max 10 MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await uploadFile(file, "cv");
      onUploaded(url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className={`img-upload-zone${uploading ? " uploading" : ""}`}>
        {uploading ? (
          <><span className="admin-spinner"></span><span>Uploading…</span></>
        ) : (
          <><i className="bi bi-file-earmark-arrow-up"></i><span>Click to upload PDF</span></>
        )}
        <input type="file" accept="application/pdf" onChange={handleFile} disabled={uploading} style={{ display: "none" }} />
      </label>
      {error && <p className="img-upload-error"><i className="bi bi-exclamation-triangle"></i> {error}</p>}
    </div>
  );
};

export const SiteSettings = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single()
      .then(({ data, error }) => {
        if (error) setError("Could not load settings.");
        else setForm(data);
        setLoading(false);
      });
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", 1);

    setSaving(false);
    if (error) setError(error.message);
    else setSuccess("Settings saved successfully!");
  };

  if (loading) return <div className="admin-loading-screen"><span className="admin-spinner admin-spinner-lg"></span></div>;
  if (!form) return <div className="admin-loading-screen"><p style={{ color: "#f87171" }}>Failed to load settings.</p></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Settings</h1>
          <p className="admin-page-sub">Control all text, images and contact info shown on the portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {error && <div className="admin-alert admin-alert-error"><i className="bi bi-exclamation-triangle-fill"></i> {error}</div>}
        {success && <div className="admin-alert admin-alert-success"><i className="bi bi-check-circle-fill"></i> {success}</div>}

        {/* ── Identity ── */}
        <div className="admin-form-card">
          <p className="admin-settings-section-title"><i className="bi bi-person-circle"></i> Identity</p>

          <div className="admin-form-row">
            <div className="admin-field">
              <label>Full Name *</label>
              <input type="text" value={form.full_name || ""} onChange={set("full_name")} required />
            </div>
            <div className="admin-field">
              <label>Header Subtitle / Title</label>
              <input type="text" placeholder="Cybersecurity Analyst • Risk & Privacy"
                value={form.headline || ""} onChange={set("headline")} />
            </div>
          </div>

          <div className="admin-form-row">
            <ImageUpload
              value={form.avatar_url}
              onChange={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
              folder="settings"
              label="Header Profile Photo (avatar)"
              hint="Square image recommended. Shown in the navigation bar."
            />
            <ImageUpload
              value={form.hero_image_url}
              onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
              folder="settings"
              label="Hero Portrait Photo"
              hint="Portrait shown on the home page hero section."
            />
          </div>
        </div>

        {/* ── Hero Section ── */}
        <div className="admin-form-card">
          <p className="admin-settings-section-title"><i className="bi bi-house"></i> Home Page</p>

          <div className="admin-field">
            <label>Eyebrow Tag (small text above headline)</label>
            <input type="text" placeholder="Cybersecurity • Governance • Privacy"
              value={form.hero_tagline || ""} onChange={set("hero_tagline")} />
          </div>
          <div className="admin-field">
            <label>Main Headline *</label>
            <textarea rows={2} placeholder="I help organisations strengthen resilience…"
              value={form.hero_headline || ""} onChange={set("hero_headline")} required />
          </div>
          <div className="admin-field">
            <label>Bio / Intro Paragraph *</label>
            <textarea rows={4} placeholder="I am Osita Kingsley Odo…"
              value={form.hero_bio || ""} onChange={set("hero_bio")} required />
          </div>
        </div>

        {/* ── Contact & Social ── */}
        <div className="admin-form-card">
          <p className="admin-settings-section-title"><i className="bi bi-envelope"></i> Contact & Social Links</p>

          <div className="admin-form-row">
            <div className="admin-field">
              <label>Email Address *</label>
              <input type="email" value={form.email || ""} onChange={set("email")} required />
            </div>
            <div className="admin-field">
              <label>Location</label>
              <input type="text" placeholder="Berlin, Germany" value={form.location || ""} onChange={set("location")} />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label>LinkedIn URL</label>
              <input type="url" placeholder="https://linkedin.com/in/…" value={form.linkedin_url || ""} onChange={set("linkedin_url")} />
            </div>
            <div className="admin-field">
              <label>GitHub URL</label>
              <input type="url" placeholder="https://github.com/…" value={form.github_url || ""} onChange={set("github_url")} />
            </div>
          </div>

          <div className="admin-field">
            <label>Twitter / X URL (optional)</label>
            <input type="url" placeholder="https://x.com/…" value={form.twitter_url || ""} onChange={set("twitter_url")} />
          </div>
        </div>

        {/* ── CV Upload ── */}
        <div className="admin-form-card">
          <p className="admin-settings-section-title"><i className="bi bi-file-earmark-person"></i> CV / Resume</p>

          {form.cv_url ? (
            <div className="cv-upload-preview">
              <div className="cv-upload-info">
                <i className="bi bi-file-earmark-pdf-fill cv-pdf-icon"></i>
                <div>
                  <p className="cv-upload-name">CV uploaded</p>
                  <a href={form.cv_url} target="_blank" rel="noopener noreferrer" className="cv-upload-link">
                    <i className="bi bi-eye"></i> Preview CV
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
                onClick={async () => {
                  await deleteImage(form.cv_url);
                  setForm((f) => ({ ...f, cv_url: null }));
                }}
              >
                <i className="bi bi-trash"></i> Remove
              </button>
            </div>
          ) : (
            <CvUpload onUploaded={(url) => setForm((f) => ({ ...f, cv_url: url }))} />
          )}

          <p className="admin-group-hint" style={{ marginTop: "0.5rem" }}>
            PDF only. Max 10 MB. This will be used for the View CV and Download CV buttons across the site.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="admin-form-card">
          <p className="admin-settings-section-title"><i className="bi bi-layout-text-window-reverse"></i> Footer</p>
          <div className="admin-field">
            <label>Footer Tagline</label>
            <input type="text" placeholder="Building digital trust — one layer at a time."
              value={form.footer_tagline || ""} onChange={set("footer_tagline")} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "2rem" }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ minWidth: 160 }}>
            {saving ? <><span className="admin-spinner"></span> Saving…</> : <><i className="bi bi-floppy"></i> Save Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
};
