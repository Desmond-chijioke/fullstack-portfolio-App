import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Pagination } from "./Pagination";

const PER_PAGE = 8;

const TYPE_LABELS = {
  conference: "Conference / Summit",
  training: "Training / Course",
  workshop: "Workshop",
  program: "Program / Initiative",
  fellowship: "Fellowship",
  hackathon: "Hackathon / CTF",
  volunteering: "Volunteering",
};

const TYPE_COLORS = {
  conference: "badge-blue",
  training: "badge-green",
  workshop: "badge-teal",
  program: "badge-purple",
  fellowship: "badge-orange",
  hackathon: "badge-red",
  volunteering: "badge-gray",
};

const DESC_LIMIT = 120;

/* ── Lightbox ────────────────────────────────────────────── */
const Lightbox = ({ src, alt, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <i className="bi bi-x-lg"></i>
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="lightbox-img" />
      </div>
    </div>
  );
};

/* ── Event Card ──────────────────────────────────────────── */
const EventCard = ({ evt }) => {
  const [expanded, setExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const longDesc = evt.description && evt.description.length > DESC_LIMIT;

  const formatDate = (start, end) => {
    if (!start) return null;
    const opts = { year: "numeric", month: "short", day: "numeric" };
    const s = new Date(start).toLocaleDateString("en-GB", opts);
    if (!end || end === start) return s;
    const e = new Date(end).toLocaleDateString("en-GB", opts);
    return `${s} – ${e}`;
  };

  return (
    <>
      <article className="info-card event-card">
        {/* Event image — click to open lightbox */}
        {evt.image_url && (
          <div
            className="event-card-img event-card-img-clickable"
            onClick={() => setLightboxOpen(true)}
            title="Click to view full image"
          >
            <img src={evt.image_url} alt={evt.title} />
            <div className="event-card-img-overlay">
              <i className="bi bi-arrows-fullscreen"></i>
            </div>
          </div>
        )}

        {/* Top row: icon + badge */}
        <div className="event-card-top">
          <div className="card-icon">{evt.icon || "🌐"}</div>
          {evt.event_type && (
            <span className={`card-badge-type ${TYPE_COLORS[evt.event_type] || ""}`}>
              {TYPE_LABELS[evt.event_type] || evt.event_type}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="event-card-title">{evt.title}</h3>

        {/* Organiser */}
        {evt.organiser && <p className="card-company">{evt.organiser}</p>}

        {/* Meta: location, date, role */}
        <div className="card-meta-row">
          {(evt.venue || evt.city || evt.country) && (
            <span className="card-meta">
              <i className="bi bi-geo-alt"></i>{" "}
              {[evt.venue, evt.city, evt.country].filter(Boolean).join(", ")}
            </span>
          )}
          {evt.event_date && (
            <span className="card-meta">
              <i className="bi bi-calendar3"></i>{" "}
              {formatDate(evt.event_date, evt.end_date)}
            </span>
          )}
          {evt.role && (
            <span className="card-meta">
              <i className="bi bi-person-badge"></i> {evt.role}
            </span>
          )}
        </div>

        {/* Description with truncation */}
        {evt.description && (
          <div className="card-desc-wrap">
            <p className="card-desc">
              {longDesc && !expanded
                ? evt.description.slice(0, DESC_LIMIT).trimEnd() + "…"
                : evt.description}
            </p>
            {longDesc && (
              <button
                className="view-more-btn"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "View less" : "View more"}
                <i className={`bi bi-chevron-${expanded ? "up" : "down"}`}></i>
              </button>
            )}
          </div>
        )}

        {/* Bullet points */}
        {evt.bullets && evt.bullets.length > 0 && (
          <ul className="detail-list">
            {evt.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}

        {/* Certificate link */}
        {evt.certificate_url && (
          <a
            href={evt.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-cert-link"
          >
            <i className="bi bi-patch-check-fill"></i> View Certificate
          </a>
        )}
      </article>

      {/* Lightbox portal */}
      {lightboxOpen && (
        <Lightbox
          src={evt.image_url}
          alt={evt.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

/* ── Events Page ─────────────────────────────────────────── */
export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, icon, title, organiser, venue, city, country, event_type, event_date, end_date, description, role, bullets, certificate_url, image_url"
        )
        .order("event_date", { ascending: false });

      if (!error && data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [filter]);

  const eventTypes = [
    "all",
    ...new Set(events.map((e) => e.event_type).filter(Boolean)),
  ];

  const filtered =
    filter === "all" ? events : events.filter((e) => e.event_type === filter);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section-block portfolio-shell">
      <div className="section-heading">
        <p className="eyebrow">Events & Programs</p>
        <h3>Conferences, workshops, and initiatives I have participated in.</h3>
        <p className="section-lead">
          A record of professional development, international engagements, and
          community programs across cybersecurity, governance, and humanitarian
          fields.
        </p>
      </div>

      {/* Filter tabs */}
      {!loading && events.length > 1 && (
        <div className="filter-tabs">
          {eventTypes.map((type) => (
            <button
              key={type}
              className={"filter-tab" + (filter === type ? " active" : "")}
              onClick={() => setFilter(type)}
            >
              {type === "all" ? "All" : TYPE_LABELS[type] || type}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="events-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="info-card skeleton-card" style={{ minHeight: 220 }}></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-calendar-x" style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.75rem", opacity: 0.35 }}></i>
          <p>No events logged yet. Check back soon.</p>
        </div>
      ) : (
        <>
          <div className="events-grid">
            {paginated.map((evt) => (
              <EventCard key={evt.id} evt={evt} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={handlePage}
            totalItems={filtered.length}
            perPage={PER_PAGE}
          />
        </>
      )}
    </section>
  );
};
