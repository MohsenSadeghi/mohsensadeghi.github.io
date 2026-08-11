# Mohsen Sadeghi's Personal Homepage

Source code for [mohsensadeghi.github.io](https://mohsensadeghi.github.io), a personal academic homepage presenting my biography, research, publications, and contact information.

## Technology

The site is built with plain HTML, CSS, and JavaScript. It has no package dependencies and requires no build step.

## Repository structure

- `index.html` contains the page structure and content.
- `general_style.css` contains shared typography, colors, navigation, and section styles.
- `home_style.css` contains homepage-specific layout styles.
- `frame_adjust.js` controls section animations and active navigation states.
- `images/` contains profile images, research figures, and social icons.
- `movies/` contains embedded research videos.
- `downloads/` contains downloadable documents.
- `robots.txt` contains crawler directives.

## Local preview

No installation is necessary. From the repository root, start a simple local web server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

## Deployment

The site is deployed through GitHub Pages directly from the root of the `master` branch. Pushing a commit to that branch publishes the static files; no separate deployment command or GitHub Actions workflow is required.
