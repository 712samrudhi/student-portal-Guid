import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { isProfileComplete } from "../data/store.js";

export default function Dashboard() {
  const { user, module } = useAuth();
  const complete = isProfileComplete(user);
  const uploaded = Object.values(user.docs).filter(Boolean).length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="muted">Module: {module?.title || "Not selected"}</p>

      <div className="grid stats">
        <div className="card stat">
          <div className="muted">Verification status</div>
          <StatusBadge status={user.status} />
        </div>
        <div className="card stat">
          <div className="muted">Documents uploaded</div>
          <div className="stat-num">{uploaded} / 4</div>
        </div>
        <div className="card stat">
          <div className="muted">Profile</div>
          <div className="stat-num">{complete ? "Complete" : "Incomplete"}</div>
        </div>
      </div>

      {!complete && (
        <div className="card notice">
          Your profile is incomplete. <Link to="/app/profile">Complete My Profile</Link> to start verification.
        </div>
      )}
    </div>
  );
}
