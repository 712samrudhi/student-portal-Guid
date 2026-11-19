import { useState } from "react";
import { getUsers, saveUsers } from "../data/store.js";
import StatusBadge from "../components/StatusBadge.jsx";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Verify" },
  { key: "verified", label: "Completed Verification" },
  { key: "rejected", label: "Rejected" },
];

const DOC_LABELS = { photo: "Photo", signature: "Signature", aadhaar: "Aadhaar", idcard: "I-Card" };

export default function AdminDashboard() {
  const [users, setUsers] = useState(getUsers());
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null); // user being reviewed

  const setStatus = (id, status) => {
    const next = users.map((u) => (u.id === id ? { ...u, status } : u));
    saveUsers(next);
    setUsers(next);
    setOpen(next.find((u) => u.id === id));
  };

  const count = (k) => (k === "all" ? users.length : users.filter((u) => u.status === k).length);

  const q = query.trim().toLowerCase();
  const list = users.filter(
    (u) =>
      (tab === "all" || u.status === tab) &&
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q))
  );

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      <div className="toolbar">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? "tab active" : "tab"} onClick={() => setTab(t.key)}>
              {t.label} ({count(t.key)})
            </button>
          ))}
        </div>
        <input className="search" placeholder="🔍 Search name, email, number" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Number</th>
              <th>Profile Verification</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan="5" className="muted center">
                  No users found
                </td>
              </tr>
            )}
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td>
                  <StatusBadge status={u.status} />
                </td>
                <td>
                  <button className="btn btn-outline" onClick={() => setOpen(u)}>
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <div className="row-between">
              <h3>{open.name}</h3>
              <StatusBadge status={open.status} />
            </div>
            <p className="muted">
              {open.email} · {open.phone || "no number"} · {open.qualification || "no qualification"}
            </p>

            <h4>ID / Aadhaar &amp; Documents</h4>
            <div className="doc-grid">
              {Object.keys(DOC_LABELS).map((k) => (
                <div key={k} className="doc">
                  <div className="upload-label">{DOC_LABELS[k]}</div>
                  {open.docs[k] ? (
                    open.docs[k].type.startsWith("image") ? (
                      <img className="thumb big" src={open.docs[k].url} alt={DOC_LABELS[k]} />
                    ) : (
                      <a href={open.docs[k].url} download={open.docs[k].name}>
                        📄 {open.docs[k].name}
                      </a>
                    )
                  ) : (
                    <span className="muted small">Not uploaded</span>
                  )}
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-success" onClick={() => setStatus(open.id, "verified")}>
                Verified
              </button>
              <button className="btn btn-danger" onClick={() => setStatus(open.id, "rejected")}>
                Rejected
              </button>
              <button className="btn btn-outline" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
