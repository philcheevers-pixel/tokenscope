# Pink House site — deploy these files

Paths are relative to the pinkhouse.tech web root (for example `/var/www/html/`).

## Pinkworks (curated shelf + bench)

Copy to `pinkworks/`:

- `pinkworks/index.html` → `pinkworks/index.html`
- `pinkworks/pinkworks-grid-20261111.css` → `pinkworks/pinkworks-grid-20261111.css`

## Inventions (trim Plimsoll & Compass)

Copy to `inventions/`:

- `inventions/index.html` → `inventions/index.html`

After upload, open https://pinkhouse.tech/pinkworks/ and confirm the five shelf cards and no Compass footer link.

## Portfolio — remove floating pink dot

Portfolio pages load `/a11y/ph-site.js`, which adds a fixed corner dot when there is no main site header. These files turn that off **only under `/portfolio/`**:

- `a11y/ph-site.js` → `a11y/ph-site.js` (bump cache: use `?v=6` or newer on portfolio script tags when convenient)
- `portfolio/css/portfolio.css` → `portfolio/css/portfolio.css` (bump `?v=` on the portfolio index if cached)
- `portfolio/css/article.css` → `portfolio/css/article.css`

After upload, open an article and the portfolio index — no dot in the top-left; rest of the site unchanged.
