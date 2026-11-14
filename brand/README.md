# VirtuaCarz brand assets

The customer site and admin panel share one mark: a rounded accent tile with a
geometric **V** for VirtuaCarz. The admin tile is inverted so the two browser
tabs are easy to tell apart.

## Palette

| Token | Hex |
| --- | --- |
| Accent | `#fa520f` |
| Accent deep | `#d94400` |
| Ink | `#18181b` |
| Ink soft | `#737373` |
| Cream | `#fbfbf8` |
| Cream deep | `#f0eee6` |
| Line | `#e5e5e5` |

Typography is [Figtree](https://fonts.google.com/specimen/Figtree) (SIL Open
Font License), loaded from Google Fonts at runtime.

## Source files

- `client/public/favicon.svg` — customer mark, accent tile.
- `admin-panel/public/favicon.svg` — admin mark, ink tile.
- `brand/og-image.svg` — source artwork for `client/public/og-image.png`
  (1200 × 630). Edit this SVG, then render it at 1200 × 630 with Figtree
  installed.

The raster files in each app's `public/` folder are generated from the SVG
sources:

| File | Size | Purpose |
| --- | --- | --- |
| `favicon-16x16.png`, `favicon-32x32.png` | 16, 32 | Browser tabs |
| `favicon.ico` | 16 + 32 | Legacy browsers and bookmarks |
| `apple-touch-icon.png` | 180 | iOS home screen |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | 192, 512 | Web app manifest / Android |
| `og-image.png` | 1200 × 630 | Open Graph and Twitter cards (customer only) |

The Apple and Android icons are flattened onto the tile color so they remain
full-bleed after the platform applies its own rounded mask.

## Metadata

Both SPAs declare their icons, manifest, theme color, and app title in
`index.html`. The customer page also includes Open Graph, Twitter Card, and
`AutoRental` JSON-LD metadata. Absolute URLs use the `__SITE_URL__` token,
which `server/server.js` replaces with the request origin at runtime. The admin
panel is marked `noindex, nofollow`, and `/robots.txt` disallows `/admin/` and
`/api/`.
