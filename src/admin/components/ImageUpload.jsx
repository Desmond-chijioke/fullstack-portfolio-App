import { useState } from "react";
import { uploadImage, deleteImage } from "../../lib/storage";

/**
 * Reusable image upload field for admin forms.
 * Props:
 *   value       — current image URL (from DB)
 *   onChange    — called with new URL after upload, or "" after remove
 *   folder      — storage folder e.g. "events", "settings"
 *   label       — field label text
 *   hint        — optional hint text
 */
export const ImageUpload = ({
  value,
  onChange,
  folder = "general",
  label = "Image",
  hint = "JPG, PNG or WebP. Max 5 MB.",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File too large — max 5 MB.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Remove this image?")) return;
    await deleteImage(value);
    onChange("");
  };

  return (
    <div className="admin-field">
      <label>{label}</label>
      {hint && <p className="admin-group-hint">{hint}</p>}

      {value ? (
        <div className="img-upload-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="img-upload-remove"
            onClick={handleRemove}
          >
            <i className="bi bi-x-lg"></i> Remove
          </button>
        </div>
      ) : (
        <label className={`img-upload-zone${uploading ? " uploading" : ""}`}>
          {uploading ? (
            <>
              <span className="admin-spinner"></span>
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <i className="bi bi-cloud-arrow-up"></i>
              <span>Click to upload image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      )}

      {error && (
        <p className="img-upload-error">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </p>
      )}
    </div>
  );
};
