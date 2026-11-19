import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/modules", label: "Module Selector" },
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/profile", label: "My Profile" },
  { to: "/app/verification", label: "Verification" },
  { to: "/app/links", label: "Important Links & Resources" },
  { to: "/app/feedback", label: "Feedback Form" },
];

export default function ToolLayout() {
  const { module } = useAuth();
  return (
    <div className="tool">
      <aside className="sidebar">
        <div className="sidebar-title">{module ? module.title : "My Tool"}</div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="tool-content">
        <Outlet />
      </section>
    </div>
  );
}
