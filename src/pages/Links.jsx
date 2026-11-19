import { IMPORTANT_LINKS } from "../config.js";

export default function Links() {
  return (
    <div>
      <h2>Important Links &amp; Resources</h2>
      <div className="card">
        <ul className="links">
          {IMPORTANT_LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                {l.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
