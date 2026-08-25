# CVUT Crossroad

[![Site Status](https://img.shields.io/badge/Status-Live-10b981.svg)](https://cvut-crossroad.com)
[![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare%20Pages-F38020.svg?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Zero Build Step](https://img.shields.io/badge/Architecture-Zero%20Build%20Step-38bdf8.svg)](#architecture)
[![Validation: Passing](https://img.shields.io/badge/Validation-Passing-10b981.svg)](#validate)

**CVUT Crossroad** is a curated shortcut and navigation platform for Czech Technical University (CVUT) students, coupled with a standalone **Horizontal Engineering & AI Horizon Timeline** tracking production software systems and frontier AI releases.

The project is built with standard, zero-build-step web technologies and is deployed to Cloudflare Pages with edge worker routing and Google AdSense compliance.

---

## 🧭 Project Overview

- **Student Directory (`/`)**: Curated search and category routing across 65+ CVUT faculties, study administration systems (KOS), e-learning (Moodle), accounts (UserMap), eduroam Wi-Fi, dorms, canteens, libraries, and student support.
- **Student Guide (`/guide`)**: Workflow-oriented guide clarifying university services and first-week orientation.
- **First-Year Checklist (`/checklist`)**: Client-side onboarding planner saving setup progress locally in the visitor's browser without tracking or login.
- **Engineering Trajectory & AI Horizon (`/roadmap`)**: Standalone horizontal interactive timeline app tracking personal engineering projects (e.g. **Insider Edge**) against the landmark foundation model releases from 2020 through 2026.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Semantic HTML5, Modern CSS (custom properties, container layout, glassmorphism, responsive grid), Vanilla JavaScript (ES Modules).
- **Edge Routing**: Cloudflare Pages with `_worker.js` and `_redirects` for clean canonical URL normalization.
- **Tooling**: Node.js automated verification (`tools/validate-site.mjs`, `tools/check-links.mjs`).
- **Zero Build Step**: Native static assets served directly with zero bundle overhead or build lag.

---

## 📁 Repository Structure

```text
cvut/
├── public/                     # Static distribution root deployed to Cloudflare
│   ├── index.html              # Main searchable CVUT directory
│   ├── guide.html              # Student guide & workflow explanations
│   ├── checklist.html          # Interactive first-year setup checklist
│   ├── roadmap.html            # Standalone Horizontal Engineering & AI Timeline
│   ├── about.html              # About & editorial rules
│   ├── sources.html            # Verified university sources index
│   ├── privacy.html            # Privacy policy & AdSense disclosure
│   ├── contact.html            # Feedback & link suggestion contact
│   ├── 404.html                # Custom error page
│   ├── app.js                  # Main directory search, filter, and storage engine
│   ├── checklist.js            # Client-side checklist state manager
│   ├── links.js                # Curated university link registry
│   ├── timeline.js             # Horizontal timeline drag-to-scroll & inspector
│   ├── timeline.css            # Dark-mode standalone timeline design system
│   ├── styles.css              # Main directory design system & typography
│   ├── _worker.js              # Cloudflare Worker for canonical URL redirects
│   ├── _redirects              # Direct 301 path rewrite rules
│   ├── _headers                # Security & caching headers
│   ├── sitemap.xml             # XML sitemap
│   └── manifest.webmanifest    # Progressive Web App manifest
├── tools/                      # Node.js developer & validation utilities
│   ├── validate-site.mjs       # Comprehensive integrity and asset validator
│   ├── check-links.mjs         # Live URL reachability checker
│   ├── add-link.mjs            # Interactive CLI helper for adding new catalog links
│   └── configure-ads.mjs       # AdSense client & slot configuration tool
├── package.json
└── wrangler.toml               # Cloudflare Pages project configuration
```

---

## ⚡ Developer Commands

### 1. Validate Site Integrity

Run the local validation suite to verify HTML pages, canonical URLs, link syntax, meta descriptions, AdSense compliance, and sitemap coverage:

```powershell
npm.cmd run check
```

### 2. Check Link Reachability

Verify that all external university destinations are live and responding:

```powershell
npm.cmd run check:links
```

### 3. Add a New Directory Link

Use the interactive CLI generator:

```powershell
npm.cmd run add-link
```

Or pass link properties via arguments:

```powershell
npm.cmd run add-link -- --title "Faculty Portal" --url "https://example.cvut.cz/" --category "Faculty" --description "Official faculty portal." --tags "faculty,portal" --icon route --accent blue
```

Available accent colors: `blue`, `green`, `amber`, `rose`, `violet`.  
Available icons: `badge`, `book`, `bookOpen`, `building`, `calendar`, `clock`, `home`, `key`, `layers`, `library`, `lifeBuoy`, `mail`, `map`, `phone`, `printer`, `route`, `utensils`, `user`, `wifi`.

---

## 🚀 Deployment

### Cloudflare Pages Deploy

Deploy the `public/` directory directly to Cloudflare Pages using Wrangler:

```powershell
npm.cmd run deploy:cloudflare
```

### Local Dev Server / Preview

```powershell
npm.cmd run preview
```

---

## 🌐 Custom Domain & DNS

- **Primary Domain**: `cvut-crossroad.com`
- **Nameservers**: Cloudflare Managed DNS
- **Subdomain fallback**: `links.cvut-crossroad.com` &rarr; `CNAME` &rarr; `cvut-links.pages.dev`

---

## 📄 License

MIT License. Designed and maintained for students and engineering portfolio tracking.
