import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { isProfileComplete } from "../data/store.js";

const DOCS = [
  { key: "photo", label: "Photo", accept: "image/*" },
  { key: "signature", label: "Signature", accept: "image/*" },
  { key: "aadhaar", label: "Aadhaar Document", accept: "image/*,application/pdf" },
  { key: "idcard", label: "I-Card (Identity Card)", accept: "image/*,application/pdf" },
];
const MAX_KB = 400;

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export default function MyProfile() {
  const { user, saveUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, qualification: user.qualification });
  const [docs, setDocs] = useState(user.docs);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = async (key, file) => {
    if (!file) return;
    if (file.size > MAX_KB * 1024) {
      setMsg({ type: "error", text: `${file.name} is too large. Max ${MAX_KB} KB for this demo.` });
      return;
    }
    setMsg({ type: "", text: "" });
    const url = await toDataUrl(file);
    setDocs({ ...docs, [key]: { name: file.name, type: file.type, url } });
  };

  const save = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) return setMsg({ type: "error", text: "Phone number must be 10 digits" });
    const updated = { ...user, ...form, docs };
    // once everything is filled, send for verification (unless already verified)
    if (isProfileComplete(updated) && (user.status === "incomplete" || user.status === "rejected")) updated.status = "pending";
    const ok = saveUser(updated);
    setMsg(
      ok
        ? { type: "success", text: "Profile saved." + (updated.status === "pending" ? " Sent for verification." : "") }
        : { type: "error", text: "Could not save – browser storage is full. Use smaller files." }
    );
  };

  return (
    <div>
      <h2>My Profile</h2>
      <form onSubmit={save}>
        <div className="card">
          <div className="profile-head">
            <div className="avatar">
              {docs.photo?.type?.startsWith("image") ? <img src={docs.photo.url} alt="Profile" /> : <span>{(form.name || "U")[0].toUpperCase()}</span>}
            </div>
            <div>
              <h3>{form.name || "User"}</h3>
              <p className="muted">{form.email}</p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={change} required />
            </label>
            <label>
              Gmail
              <input name="email" type="email" value={form.email} onChange={change} required disabled />
            </label>
            <label>
              Number
              <input name="phone" value={form.phone} onChange={change} placeholder="10-digit mobile" required />
            </label>
            <label>
              Current Qualification
              <input name="qualification" value={form.qualification} onChange={change} placeholder="e.g. B.Sc, 12th" required />
            </label>
          </div>
        </div>

        <div className="card">
          <h3>Upload Documents</h3>
          <div className="form-grid">
            {DOCS.map((d) => (
              <div key={d.key} className="upload">
                <div className="upload-label">{d.label}</div>
                <input type="file" accept={d.accept} onChange={(e) => pickFile(d.key, e.target.files[0])} />
                {docs[d.key] ? (
                  <div className="file-ok">
                    ✓ {docs[d.key].name}
                    {docs[d.key].type.startsWith("image") && <img className="thumb" src={docs[d.key].url} alt={d.label} />}
                  </div>
                ) : (
                  <div className="muted small">Not uploaded (max {MAX_KB} KB)</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {msg.text && <div className={msg.type === "error" ? "error" : "success"}>{msg.text}</div>}
        <button className="btn btn-primary" type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
}
