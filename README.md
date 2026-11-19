# Student Portal – Frontend (React + Vite)

Frontend-only UI. No backend needed – data is stored in the browser (localStorage) for demo.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Login
- **User:** any valid email + password of 4+ characters
- **Admin:** username `admin`, password `admin123`

## Flow
User: Login → Module Selector (Mentoring / Career Guides / Scholarship Scheme) → My Tool
(Dashboard, My Profile, Verification, Important Links & Resources, Feedback Form)

Admin: Login → Admin Dashboard → search, tabs (Pending / Completed / Rejected) → Review → Verified / Rejected

## Customize
- App name, version, copyright year, modules, links: `src/config.js`
- Replace `src/data/store.js` with real API calls when the backend is ready.
