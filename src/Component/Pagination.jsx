/**
 * Reusable pagination bar.
 *
 * Props:
 *   page        — current page (1-indexed)
 *   totalPages  — total number of pages
 *   onPage      — callback(newPage)
 *   totalItems  — total item count (for display)
 *   perPage     — items per page (for display)
 */
export const Pagination = ({ page, totalPages, onPage, totalItems, perPage }) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  // Build page number array with ellipsis
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="pagination-wrap">
      <p className="pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{totalItems}</strong>
      </p>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={"pagination-btn" + (p === page ? " active" : "")}
              onClick={() => onPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className="pagination-btn"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
