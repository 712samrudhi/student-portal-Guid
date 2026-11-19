const LABELS = {
  verified: "Verified",
  pending: "Pending",
  rejected: "Rejected",
  incomplete: "Incomplete",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] || status}</span>;
}
