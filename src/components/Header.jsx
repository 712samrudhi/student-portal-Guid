import { useAuth } from "../context/AuthContext.jsx";
import { APP_NAME } from "../config.js";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { session, user, logout } = useAuth();
  const navigate = useNavigate();
  const label = session?.role === "admin" ? "Admin" : user?.name;
  const farewell = session?.role === "admin" ? "Admin" : user?.email;

  if (!session) return null; // login page has its own full-screen layout

  return (
    <header className="header">
      <div className="brand">{APP_NAME}</div>
      {session && (
        <div className="header-right">
          <span className="who">{label}</span>
          <button
            className="btn btn-outline"
            onClick={() => {
              logout();
              navigate("/login", { state: { loggedOut: farewell } });
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
