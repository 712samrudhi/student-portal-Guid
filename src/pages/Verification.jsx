import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const ROWS = [
  { key: "photo", label: "Photo" },
  { key: "signature", label: "Signature" },
  { key: "aadhaar", label: "Aadhaar Document" },
  { key: "idcard", label: "I-Card" },
];

const MESSAGES = {
  incomplete: "Complete your profile and upload all documents to submit for verification.",
  pending: "Your documents are submitted. Waiting for admin to verify.",
  verified: "Your profile is verified. 🎉",
  rejected: "Your profile was rejected. Please re-upload correct documents and save again.",
};

export default function Verification() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Verification</h2>
      <div className="card">
        <div className="row-between">
          <h3>Profile Verification</h3>
          <StatusBadge status={user.status} />
        </div>
        <p className="muted">{MESSAGES[user.status]}</p>

        <table className="table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.key}>
                <td>{r.label}</td>
                <td>{user.docs[r.key] ? "✓ Yes" : "✗ No"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {(user.status === "incomplete" || user.status === "rejected") && (
          <Link className="btn btn-primary" to="/app/profile">
            Go to My Profile
          </Link>
        )}
      </div>
    </div>
  );
}
