# WeruLux — Landing Page

Official landing page for WeruLux, an AI-powered travel wellness platform combining circadian science and biometric data to personalize every journey.

**Live:** https://werulux.com/

---

## About

WeruLux is built for travelers, airlines, and corporations who understand that human performance depends on biological rhythm — not just logistics. The platform delivers neuroadaptive, real-time, biologically personalized recommendations before, during, and after every flight.

Established in Japan · Tokyo | Dubai · Est. 2026

---

## Stack

- Jekyll (static site generator) — no database, no server
- Vanilla CSS / JavaScript, no frameworks
- Sveltia CMS at `/admin/` for content editing
- Deployed to GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`)

## Structure

```
_layouts/default.html   page shell (head, nav, footer, scripts)
_includes/*.html        one file per section (hero, problem, solution, ...)
_data/*.yml             editable content: team, advisors, stats, value tabs, tech features, phone screenshots
assets/css/main.css     all styles
assets/js/main.js       all scripts
admin/                  Sveltia CMS (config.yml defines the editing UI)
_backup/                pre-Jekyll snapshot of the original single-file page (not published)
```

## Editing content

Most copy changes need **no HTML**: edit the matching file in `_data/`
(team members, advisors, hero stats, value-creation tabs, technology features,
phone screenshots). Section markup lives in `_includes/`.

Or use the CMS at `/admin/` — locally it can work directly on the folder
("Work with Local Repository"); in production it commits through GitHub
(set the real `repo:` in `admin/config.yml` first).

## Local development

```
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.
