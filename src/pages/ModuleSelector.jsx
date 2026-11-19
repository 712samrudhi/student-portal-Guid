import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MODULES } from "../config.js";

export default function ModuleSelector() {
  const { chooseModule, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2>Module Selector</h2>
      <p className="muted">Welcome{user?.name ? `, ${user.name}` : ""}. Select a module to continue.</p>
      <h3>My Modules</h3>
      <div className="grid">
        {MODULES.map((m) => (
          <button
            key={m.id}
            className="card module-card"
            onClick={() => {
              chooseModule(m);
              navigate("/app/dashboard");
            }}
          >
            <div className="module-icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p className="muted">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
