import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => "admin-nav-link" + (isActive ? " active" : "")}
  >
    <i className={`bi bi-${icon}`}></i>
    {children}
  </NavLink>
);

export const AdminLayout = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <i className="bi bi-shield-lock-fill"></i>
          <span>Portfolio CMS</span>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">Overview</p>
          <NavItem to="/admin/dashboard" icon="grid-1x2">Dashboard</NavItem>

          <p className="admin-nav-label">Content</p>
          <NavItem to="/admin/experiences" icon="briefcase">Experiences</NavItem>
          <NavItem to="/admin/events" icon="calendar-event">Events & Programs</NavItem>
          <NavItem to="/admin/education" icon="mortarboard">Education</NavItem>
          <NavItem to="/admin/skills" icon="tools">Skills</NavItem>

          <p className="admin-nav-label">Site</p>
          <NavItem to="/admin/settings" icon="gear">Site Settings</NavItem>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <i className="bi bi-person-circle"></i>
            <span className="admin-user-email">{user?.email}</span>
          </div>
          <div className="admin-sidebar-actions">
            <Link to="/" className="admin-btn admin-btn-ghost admin-btn-sm">
              <i className="bi bi-eye"></i> View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-danger"
            >
              <i className="bi bi-box-arrow-right"></i> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};
