# byteshire-web

The static website for [byteshire.com](https://byteshire.com). Built with [Astro](https://astro.build) and published to GitHub Pages by a GitHub Action on every push to `main`. `SPEC.md` says who the site is for and the principles behind it.

## How it's put together

Each app is described once, in `src/content/apps/<slug>.yaml`, and every page about it is generated from that file. `src/content.config.ts` defines the schema; a missing or misspelled field fails the build rather than publishing a broken page.

| URL | Source |
| --- | --- |
| `/` | `src/pages/index.astro` — Byteshire home, one card per app with `summary` and `landingPage: true` |
| `/discboard/` | `src/pages/discboard/index.astro` — Discboard landing page |
| `/<app>-privacy/`, `/<app>-terms/` | `src/content/legal/<app>-<kind>.md`, rendered by `src/pages/[page].astro` |
| `/<app>/<channel>/` | the app's `shortLinks`, rendered by `src/pages/[app]/[channel].astro` — campaign short links (see below) |
| `/discboards/<slug>/` | `discboards/<slug>/index.html` front matter, rendered by `src/pages/discboards/[slug]/index.astro` — promo boards |
| `/b/<slug>/` | `b/<slug>/index.html` front matter — the old board URLs, forwarding to `/discboards/<slug>/` |

Brand colors, type and sizes live in `src/styles/tokens.css`, as Tailwind v4 `@theme` tokens.

## The URLs are load-bearing — do not break them

Every app's privacy and terms pages are linked from its App Store listing, and the subscription apps link to theirs from in-app paywalls. The campaign short links are in live posts and bios. The Discboard app downloads board files from `/discboards/<slug>/` and, for version 1.3.1, from `/b/<slug>/`. `.well-known/apple-app-site-association` powers Discboard's Universal Links.

`tests/url-contract.txt` lists every one of these paths. `npm run build` ends with `tests/check-url-contract.sh`, which fails the build — and so the deploy — if any is missing. Add a path to the contract whenever something outside the site starts depending on it.

GitHub Pages serves the trailing-slash form (`/discboard-privacy/`) and 301-redirects the bare form (`/discboard-privacy`), which browsers and in-app web views follow transparently.

## Files Discboard's publish script writes

Discboard's `scripts/publish_board.py` writes promo boards into this repo at `discboards/<slug>/` and `b/<slug>/`, in Jekyll's front-matter format, and checks that `.well-known/` sits at the repo root. Those folders stay where the script expects them: `src/content.config.ts` reads their `index.html` front matter, and `src/integrations/passthrough.mjs` copies everything else in them — the board files, wallpapers, and the `b/` symlinks, dereferenced — into the built site byte for byte.

## Campaign short links

An app's `shortLinks` map channels to campaign tokens. Each becomes `/<app>/<channel>/`, a page that forwards to the App Store with the app's provider token and that campaign token, so App Store Connect → Analytics → Acquisition → Campaigns can attribute installs to the link that produced them. `src/lib/appstore.ts` builds every store link. The Discboard landing page's download button carries `ct=byteshire-web`, and promo boards carry `ct=promo-<slug>`.

They exist because a short-form video caption cannot be tapped, so the link has to be short enough to say out loud and type — `byteshire.com/discboard/youtube` — and because a redirect can be re-pointed later without editing a post that is already live.

Token convention: TikTok and Instagram only ever get a bio link, so their tokens are evergreen (`bio-tiktok`, `bio-instagram`). YouTube, Bluesky and Reddit links go in individual posts, so their tokens name the release they were posted for (`1.3-carplay-youtube`); bump them when the next release's posts go out. A campaign row only appears in App Store Connect once five distinct Apple Accounts have installed through it.

## Local preview

Requires Node 22.23.4 or later (`brew install node`).

```sh
npm install
npm run dev        # live-reloading dev server at http://localhost:4321
npm run build      # type check, build to dist/, check the URL contract
npm run preview    # serve dist/
```

The dev server doesn't serve the passthrough files (board files, wallpapers, the association file); `npm run build` then `npm run preview` does.

## Deploy

Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages. The custom domain comes from the `CNAME` file. The repo's Pages source must be set to **GitHub Actions**.
