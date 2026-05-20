# news-archive/

Working tree for the `morning-news` scheduled task's published output. Each fire writes today's standalone HTML brief here, then pushes via `/tmp` clone to `github.com/yellinmatt/morning-news` (served at `https://yellinmatt.github.io/morning-news/`).

## Contents

| File | Purpose |
|---|---|
| `YYYY-MM-DD.html` | One per day. The full Broadsheet (masthead, character line, bias legend, numbered items, audit footer) as a self-contained HTML file with iOS PWA meta. |
| `index.html` | Rolling 7-day landing page. Lists today's brief on top with the headline of the lead item, then descending by date. Regenerates each morning. |
| `_index_template.html` | Shell the regeneration script renders into. Contains `<!--ROWS-->` placeholder where the day list lands. |
| `.publish-auth` | GitHub PAT (chmod 600, gitignored). Fine-grained PAT scoped to `morning-news` repo only (Contents: read+write). |
| `README.md` | This file. |

## Retention policy

**Rolling 7-day window on the published site.** The /tmp clone is the source-of-truth for what's published. Each fire copies today's file into the clone, then purges anything older than today minus 7 days, regenerates `index.html`, commits, pushes. Published GitHub Pages copy thus shows exactly the last 7 daily files.

**The local `news-archive/` tree accumulates** because the Cowork sandbox-mount blocks `rm` (same constraint that broke in-place git on `Basic Knowledge/Lessons/`). Matthew can manually clean the local tree in Finder if file count grows uncomfortably. The published copy is always rolling.

## Authoring rules

- HTML files are self-contained (inline CSS, no JS, no external fonts).
- iOS PWA `<head>` meta is required so "Add to Home Screen" produces a labeled full-screen icon. See `Tools/widget-style-match/kits/icloud-pwa-shell.md` for the wrapper template.
- Light + dark mode via `prefers-color-scheme`.
- Tier-color CSS values (L `#2E5BB7`, LL `#5C8DCE`, C `#888780`, LR `#CD6F6F`, R `#B53636`) hardcoded in each daily file's inline `<style>` block — do not depend on Cowork CSS variables, the file renders standalone in iOS Safari.
- Every daily file includes a top-of-page back-link to `index.html`.

## Publish flow

See `~/Documents/Claude/Scheduled/morning-news/SKILL.md` § "Publish step — /tmp clone-rsync-push with 7-day rolling purge" for the bash recipe. Do NOT run git on this folder directly; in-place git deadlocks on `.git/*.lock` files (verified 2026-05-19).

## Remote

- Repo: `github.com/yellinmatt/morning-news`
- Branch: `main`, Pages from `main` / root
- Live URL: `https://yellinmatt.github.io/morning-news/`
- Setup date: 2026-05-19
