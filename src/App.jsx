import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { Header } from "./Component/Header";
import { Footer } from "./Component/Footer";
import { Home } from "./Component/Home";
import { Experience } from "./Component/Experience";
import { Education } from "./Component/Education";
import { Skill } from "./Component/Skill";
import { Contact } from "./Component/Contact";
import { Events } from "./Component/Events";

// Admin
import { AuthProvider } from "./admin/hooks/useAuth";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { Login } from "./admin/auth/Login";
import { Dashboard } from "./admin/pages/Dashboard";
import { UploadExperience } from "./admin/pages/UploadExperience";
import { UploadEvent } from "./admin/pages/UploadEvent";
import { ExperienceList } from "./admin/pages/ExperienceList";
import { EventList } from "./admin/pages/EventList";
import { UploadEducation } from "./admin/pages/UploadEducation";
import { EducationList } from "./admin/pages/EducationList";
import { UploadSkill } from "./admin/pages/UploadSkill";
import { SkillList } from "./admin/pages/SkillList";
import { SiteSettings } from "./admin/pages/SiteSettings";

import "./App.css";

// Renders Header + Footer on every public route, never on admin routes
const PublicShell = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return children;
  return (
    <div className="site-shell">
      <Header />
      <div className="page-wrapper">{children}</div>
      <Footer />
    </div>
  );
};

// Helper — wraps a page in ProtectedRoute + AdminLayout
const AdminPage = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PublicShell>
          <Routes>
            {/* ── Public portfolio routes ── */}
            <Route path="/"           element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education"  element={<Education />} />
            <Route path="/skills"     element={<Skill />} />
            <Route path="/events"     element={<Events />} />
            <Route path="/contact"    element={<Contact />} />

            {/* ── Admin auth ── */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin"       element={<Navigate to="/admin/dashboard" replace />} />

            {/* ── Admin dashboard ── */}
            <Route path="/admin/dashboard" element={<AdminPage><Dashboard /></AdminPage>} />

            {/* ── Admin: Site Settings ── */}
            <Route path="/admin/settings" element={<AdminPage><SiteSettings /></AdminPage>} />

            {/* ── Admin: Experiences ── */}
            <Route path="/admin/experiences"          element={<AdminPage><ExperienceList /></AdminPage>} />
            <Route path="/admin/experiences/new"      element={<AdminPage><UploadExperience /></AdminPage>} />
            <Route path="/admin/experiences/:id/edit" element={<AdminPage><UploadExperience /></AdminPage>} />

            {/* ── Admin: Events ── */}
            <Route path="/admin/events"          element={<AdminPage><EventList /></AdminPage>} />
            <Route path="/admin/events/new"      element={<AdminPage><UploadEvent /></AdminPage>} />
            <Route path="/admin/events/:id/edit" element={<AdminPage><UploadEvent /></AdminPage>} />

            {/* ── Admin: Education ── */}
            <Route path="/admin/education"          element={<AdminPage><EducationList /></AdminPage>} />
            <Route path="/admin/education/new"      element={<AdminPage><UploadEducation /></AdminPage>} />
            <Route path="/admin/education/:id/edit" element={<AdminPage><UploadEducation /></AdminPage>} />

            {/* ── Admin: Skills ── */}
            <Route path="/admin/skills"          element={<AdminPage><SkillList /></AdminPage>} />
            <Route path="/admin/skills/new"      element={<AdminPage><UploadSkill /></AdminPage>} />
            <Route path="/admin/skills/:id/edit" element={<AdminPage><UploadSkill /></AdminPage>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PublicShell>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
