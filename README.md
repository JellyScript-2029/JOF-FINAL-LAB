# JOF — Portfolio Website
 
A responsive, JSON-driven portfolio site for **Jhelianne Figuerres (JOF)** — Frontend Developer & UI/UX Designer. Built with plain HTML, CSS, and JavaScript (no frameworks, no build step), with all content pulled dynamically from a single `data.json` file.
 
## Features
 
- **JSON-driven content** — profile info, skills, projects, timeline, and contact links are all rendered from `data.json`. Add a new project or skill without touching the HTML.
- **Profile photo** — hero section includes a photo, sourced from `profile.photo` in `data.json` (currently a placeholder monogram at `assets/profile.svg` — swap in a real headshot any time).
- **Filterable skills & projects** — category filter buttons generated automatically from the data.
- **Skill proficiency bars** — each skill renders a `role="progressbar"` bar driven by a `level` (0–100) value in `data.json`.
- **Responsive, mobile-first layout** — collapsible nav menu on small screens, CSS Grid layouts that adapt at `768px` and `1200px` breakpoints.
- **Scroll reveal animations** — sections fade/slide into view using `IntersectionObserver`.
- **Active nav highlighting** — the nav link for the section currently in view is highlighted automatically.
- **Client-side contact form validation** — checks name, email, and message length before showing a status message (no backend wired up yet).
- **Accessible by default** — skip link, `aria-live` status region, `aria-expanded`/`aria-selected`/`aria-valuenow` states, visible focus outlines, and respects `prefers-reduced-motion`.
- **Commented code** — `styles.css` and `script.js` both have explanatory comments at the top of each function/section.
## Tech Stack
 
- HTML5 (semantic markup)
- CSS3 (Flexbox, Grid, custom properties, `color-mix`)
- Vanilla JavaScript (Fetch API, DOM APIs, `IntersectionObserver`)
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Work Sans](https://fonts.google.com/specimen/Work+Sans), and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
## Project Structure
 
```
.
├── index.html          # Page markup (content is populated at runtime)
├── data.json           # All site content: profile, skills, projects, timeline, contact
├── css/
│   └── styles.css      # Site styling
├── js/
│   └── script.js       # Fetches data.json and renders everything
└── assets/
    └── profile.svg     # Placeholder profile photo — replace with a real headshot
```
 
## Getting Started
 
Because the site fetches `data.json` via the Fetch API, opening `index.html` directly from the filesystem (`file://`) will **not** work in most browsers due to CORS restrictions. Run it through a local server instead.
 
### Option 1: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.
### Option 2: Python
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
 
### Option 3: Node
```bash
npx serve .
```
 
## Customizing Content
 
All editable content lives in `data.json`:
 
| Section | Key | Notes |
|---|---|---|
| Hero / About | `profile` | name, role, tagline, bio, location, `photo` (path), `photoAlt` |
| Skills | `skills` | array of `{ name, category, level }` — `level` is 0–100 and drives the proficiency bar; categories auto-generate filter buttons |
| Projects | `projects` | array of `{ title, category, description, tags, link }` |
| Timeline | `timeline` | array of `{ year, title, place, description }` |
| Contact | `contact` | `email` and `github` — rendered as links |
 
Add or remove entries in any array and the page will update automatically on next load — no HTML edits required.
 
## Validation
 
Checked with [`html5validator`](https://pypi.org/project/html5validator/) (a local wrapper around the same [Nu Html Checker](https://validator.w3.org/nu/) the W3C validator uses): **the HTML passes with zero errors or warnings.**
 
Running it in `--also-check-css` mode reports several CSS "errors" — these are false positives, not real problems. The bundled CSS checker is an old, frozen profile that predates modern, well-supported CSS: it doesn't recognize logical properties (`padding-block`, `margin-inline`, `inset`), `backdrop-filter`, or `color-mix()`, all of which are valid CSS and render correctly in current browsers. No changes were made to "fix" these.
 
## Deployment
 
Not yet deployed. To publish for submission, pick one:
 
**GitHub Pages**
```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / root**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.
 
**Vercel**
1. Push the project to a GitHub repo (steps above).
2. Go to [vercel.com](https://vercel.com), **Add New → Project**, and import the repo.
3. Leave the default settings (no build command needed — it's static) and click **Deploy**.
## Known Gaps
 
- **Contact form has no backend.** On successful validation it just shows a status message; hook it up to a service like [Formspree](https://formspree.io) or your own endpoint to actually send messages.
- **Profile photo is a placeholder.** `assets/profile.svg` is a generated initials monogram, not a real photo — drop a real headshot into `assets/` and update `profile.photo` in `data.json` to point at it.
- **Skill proficiency levels are self-rated estimates**, not derived from anything — adjust the `level` values in `data.json` to reflect your own honest assessment.
- **Site isn't deployed yet** — see [Deployment](#deployment) above.
## Browser Support
 
Uses modern CSS (`color-mix()`, CSS Grid) and JS (`IntersectionObserver`, Fetch API) — works in current versions of Chrome, Firefox, Safari, and Edge.
 
## Credits
 
Built by **Jhelianne Figuerres** as part of coursework at Lorma Colleges.
 
- GitHub: [github.com/JellyScript-2029](https://github.com/JellyScript-2029)
- Email: jhelianne.figuerres@lorma.edu