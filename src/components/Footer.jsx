import { APP_VERSION, COPYRIGHT_YEAR } from "../config.js";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© Copyright {COPYRIGHT_YEAR} All rights reserved</span>
      <span>Version {APP_VERSION}</span>
    </footer>
  );
}
