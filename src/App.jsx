import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import ModuleSelector from "./pages/ModuleSelector.jsx";
import ToolLayout from "./pages/ToolLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Verification from "./pages/Verification.jsx";
import Links from "./pages/Links.jsx";
import Feedback from "./pages/Feedback.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function RequireUser({ children }) {
  const { session, user } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === "admin") return <Navigate to="/admin" replace />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { session } = useAuth();
  if (!session || session.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { session } = useAuth();
  const home = !session ? "/login" : session.role === "admin" ? "/admin" : "/modules";

  return (
    <div className="shell">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/login" element={session ? <Navigate to={home} replace /> : <Login />} />
          <Route path="/modules" element={<RequireUser><ModuleSelector /></RequireUser>} />
          <Route path="/app" element={<RequireUser><ToolLayout /></RequireUser>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="verification" element={<Verification />} />
            <Route path="links" element={<Links />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
