import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/dashboard`, {
          credentials: "include",
        });
        if (!res.ok) {
          setError("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setError("Failed to load dashboard.");
      }
    };
    fetchUser();
  }, [navigate]);

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="glass-card" style={{ maxWidth: "550px" }}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <button
            onClick={logout}
            className="btn-primary btn-secondary"
            style={{ width: "auto", margin: 0, padding: "0.5rem 1.25rem" }}
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="error-msg">{error}</div>
        ) : !user ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : (
          <div>
            <h3 className="welcome-text">
              Hello, <span className="highlight">{user.name}</span> 👋
            </h3>
            <p className="email-text">
              {user.email}
            </p>
            <div className="info-card">
              <p>
                Your email was verified via OTP and your account is secured with
                an HTTP-only JWT cookie. This page is fully protected.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
