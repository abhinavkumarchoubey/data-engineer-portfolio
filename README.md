# data-engineer-portfolio

Source for abhinavkumarchoubey.github.io/data-engineer-portfolio.

## Structure

```
src/                 edit this
  index.html         page content, references includes as
                      <!--#include partials/header.html-->
  partials/
    header.html       nav bar
    footer.html        contact footer
  assets/
    css/style.css
    js/main.js
    img/headshot.jpg
    resume/Abhinav_Kumar_Resume.pdf

docs/                generated — do not hand-edit, gets wiped on every build
build.js             stitches partials into docs/*.html, copies assets
```

## Build

No dependencies to install — `build.js` only uses Node's built-in `fs`/`path`.

```
node build.js
```

or

```
npm run build
```

This regenerates `docs/` from `src/`. Run it after every edit, then commit
both `src/` and the regenerated `docs/`.

## Deploy (first time)

1. Create the GitHub repo `data-engineer-portfolio` under `abhinavkumarchoubey`.
2. Push this project to the `main` branch.
3. In the repo's **Settings → Pages**, set:
   - Source: `Deploy from a branch`
   - Branch: `main`, folder: `/docs`
4. Site goes live at `https://abhinavkumarchoubey.github.io/data-engineer-portfolio/`
   after a minute or two.

## Updating content later

Edit files under `src/`, run `node build.js`, commit and push both `src/`
and `docs/`. GitHub Pages redeploys automatically on push.
