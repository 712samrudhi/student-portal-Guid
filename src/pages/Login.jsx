import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../config.js";

const FEATURES = [
  "Secure authentication & role-based access",
  "Profile & document verification",
  "Multi-module support",
  "Mentoring, career guides & scholarship scheme",
  "24/7 availability",
];

// Frontend demo OTP. Replace with a real API call when the backend is ready.
const DEMO_OTP = "123456";
const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // steps: choose | otp-email | otp-verify | google | admin
  const [step, setStep] = useState("choose");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(location.state?.loggedOut ? `Goodbye ${location.state.loggedOut}! You have been logged out.` : "");

  useEffect(() => {
    if (!info) return;
    const t = setTimeout(() => setInfo(""), 6000);
    return () => clearTimeout(t);
  }, [info]);

  const go = (s) => {
    setStep(s);
    setError("");
  };

  const finishUser = () => {
    login({ role: "user", email: email.trim() });
    navigate("/modules");
  };

  const sendOtp = (e) => {
    e.preventDefault();
    if (!emailOk(email)) return setError("Enter a valid email address");
    go("otp-verify");
  };
  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) return setError("Invalid OTP");
    finishUser();
  };
  const googleLogin = (e) => {
    e.preventDefault();
    if (!emailOk(email)) return setError("Enter a valid Gmail address");
    finishUser();
  };
  const adminLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "admin" || password !== "admin123") return setError("Invalid admin credentials");
    login({ role: "admin" });
    navigate("/admin");
  };

  return (
    <div className="login-page">
      {info && (
        <div className="toast">
          <span>
            <b>Info:</b> {info}
          </span>
          <button onClick={() => setInfo("")} aria-label="Close">
            ×
          </button>
        </div>
      )}

      <div className="login-grid">
        <section className="welcome">
          <h1>Welcome to {APP_NAME}</h1>
          <p>Manage your profile, upload documents, track verification and access mentoring, career guides and scholarship schemes.</p>
          <ul>
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="tick">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="signin-card">
          <h2>Sign In</h2>
          <p className="muted">Access your account</p>

          {step === "choose" && (
            <>
              <button className="btn-otp" onClick={() => go("otp-email")}>
                ✉ Sign In with OTP
              </button>
              <div className="or">
                <span>or</span>
              </div>
              <button className="btn-google" onClick={() => go("google")}>
                <b>G</b> Continue with Google
              </button>
              <button className="link-btn" onClick={() => go("admin")}>
                Admin login
              </button>
            </>
          )}

          {step === "otp-email" && (
            <form onSubmit={sendOtp}>
              <label>
                Email
                <input autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
              </label>
              {error && <div className="error">{error}</div>}
              <button className="btn-otp" type="submit">
                Send OTP
              </button>
              <button type="button" className="link-btn" onClick={() => go("choose")}>
                ← Back
              </button>
            </form>
          )}

          {step === "otp-verify" && (
            <form onSubmit={verifyOtp}>
              <p className="muted small">
                OTP sent to <b>{email}</b>
                <br />
                (Demo: use {DEMO_OTP})
              </p>
              <label>
                Enter OTP
                <input autoFocus value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit OTP" />
              </label>
              {error && <div className="error">{error}</div>}
              <button className="btn-otp" type="submit">
                Verify &amp; Sign In
              </button>
              <button type="button" className="link-btn" onClick={() => go("otp-email")}>
                ← Change email
              </button>
            </form>
          )}

          {step === "google" && (
            <form onSubmit={googleLogin}>
              <p className="muted small">Frontend demo: enter your Gmail to continue (real Google sign-in needs a backend).</p>
              <label>
                Gmail
                <input autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
              </label>
              {error && <div className="error">{error}</div>}
              <button className="btn-google" type="submit">
                <b>G</b> Continue with Google
              </button>
              <button type="button" className="link-btn" onClick={() => go("choose")}>
                ← Back
              </button>
            </form>
          )}

          {step === "admin" && (
            <form onSubmit={adminLogin}>
              <label>
                Username
                <input autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" />
              </label>
              {error && <div className="error">{error}</div>}
              <button className="btn-otp" type="submit">
                Admin Sign In
              </button>
              <button type="button" className="link-btn" onClick={() => go("choose")}>
                ← Back
              </button>
            </form>
          )}

          <div className="secure-note">
            <span>🛡</span>
            <p>
              <b>Secure Login:</b> Your login attempts are tracked for security.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
