import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Signup() {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STEP 1: Submit signup form → receive OTP on email
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsError(false);
        setMsg(data.message);
        setStep(2); // move to OTP step
      } else {
        setIsError(true);
        setMsg(data.message);
      }
    } catch {
      setIsError(true);
      setMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Submit OTP → account created
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsError(false);
        setMsg(data.message + " Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setIsError(true);
        setMsg(data.message);
      }
    } catch {
      setIsError(true);
      setMsg("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h2 className="title">{step === 1 ? "Create Account" : "Verify OTP"}</h2>

        {step === 1 ? (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p className="otp-hint">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input-field otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </form>
        )}

        <div className="redirect-container">
          Already have an account?
          <button onClick={() => navigate("/")} className="redirect-link">
            Log in
          </button>
        </div>

        {msg && (
          <div className={isError ? "error-msg" : "success-msg"}>{msg}</div>
        )}
      </div>
    </div>
  );
}
