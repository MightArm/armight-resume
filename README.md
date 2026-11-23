# Muhammad Arman Nazari — MightArm

A plain static personal website (HTML/CSS/vanilla JS only) with a pixel-art, chill-blue theme. No framework, no build step, no dependencies, no `package.json`. Designed to be pushed to GitHub and imported into Vercel.

## Who it's for

Muhammad Arman Nazari (Persian: محمد آرمان نظری), computer science student at Amirkabir University of Technology (AUT), Iran. Online handle: MightArm.

## Repository contents

- `index.html` — all visible text lives here (easy to translate to Persian later), semantic HTML, meta/Open Graph/Twitter tags, skip link, sections ("rooms"), link buttons.
- `style.css` — pixel-art theme, Vazirmatn `@font-face`, CSS logical properties, mobile first, `prefers-reduced-motion` support.
- `script.js` — word-by-word typewriter via `IntersectionObserver`, scroll-progress pixel heart, parallax starfield, save-point stars, optional Web Audio blip, sound toggle.
- `favicon.svg` — inline-SVG pixel heart.
- `fonts/Vazirmatn-variable.woff2` — Vazirmatn variable font (you must download this; see below). Referenced by `style.css`.
- `fonts/README.md` — instructions for downloading the font.
- `vercel.json` — `cleanUrls` plus long-cache headers for fonts and static assets.
- `.gitignore` — ignores the font binary and OS/log files.
- `README.md` — this file.

## The font (required step)

The `@font-face` in `style.css` already points at `fonts/Vazirmatn-variable.woff2`, but the binary is **not** in the repo (it's in `.gitignore`). Before the custom font appears, download it:

1. Go to the official Vazirmatn repository (SIL Open Font License):
   https://github.com/rastikerdar/vazirmatn
2. Download the variable web font file:
   `fonts/webfonts/Vazirmatn[wght].woff2`
   Raw URL:
   https://raw.githubusercontent.com/rastikerdar/vazirmatn/master/fonts/webfonts/Vazirmatn%5Bwght%5D.woff2
3. Save it into this repository as:
   `fonts/Vazirmatn-variable.woff2`
4. Commit everything else; the font file itself stays local per `.gitignore` (or add it if you prefer).

The font covers both Latin and Persian, so the later Persian version needs no font change.

## Translating to Persian

All visible text is inside `index.html` (not in JS). To switch to Persian:

- Edit `index.html`: change `lang="en"` to `lang="fa"` and `dir="ltr"` to `dir="rtl"` on the `<html>` element.
- Replace the English copy with your Persian text. Keep the Persian name wrapped in `<bdi lang="fa" dir="rtl">` in the hero.
- CSS already uses logical properties (`margin-inline`, `padding-inline`, `inset-inline-start/end`, `text-align: start`) so the layout flips safely for RTL.
- The typewriter reveals by whole words, so connected Persian letters work correctly.

## How to push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: MightArm personal site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## How to deploy on Vercel

1. Go to https://vercel.com and add a new project.
2. Choose "Import Git Repository" and select this repo.
3. Framework Preset: **Other** (do not pick a framework).
4. Build Command: leave empty / no build command.
5. Output Directory: leave as the root (or `.`).
6. Deploy.

Vercel serves the static files directly. `vercel.json` handles clean URLs and long cache headers for `/fonts` and static assets.

## Performance

- Total weight under 60 KB excluding the font.
- No images, no third-party or CDN requests; everything is self-hosted.
- Semantic HTML, skip link, good heading order (`h1` → `h2`s), full keyboard navigation, visible focus states.
- Mobile first, tested from 320 px up.
- Respects `prefers-reduced-motion`: text shows immediately, parallax and animations disabled.

## License

Site code: MIT. Font: SIL Open Font License (see upstream Vazirmatn repository).