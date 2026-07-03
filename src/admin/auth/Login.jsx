import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h1>Admin Portal</h1>
          <p>Osita Kingsley Odo — Portfolio CMS</p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          {error && (
            <div className="admin-alert admin-alert-error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {error}
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="email">Email address</label>
            <div className="admin-input-wrap">
              <i className="bi bi-envelope"></i>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrap">
              <i className="bi bi-lock"></i>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="admin-login-back">
          <a href="/">
            <i className="bi bi-arrow-left"></i> Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
};
