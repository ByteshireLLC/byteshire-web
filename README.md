# byteshire-web

The static website for [byteshire.com](https://byteshire.com) and the Discboard product pages. Built with Jekyll and served by GitHub Pages — no build step or GitHub Action to maintain, because GitHub Pages compiles Jekyll natively on every push.

## Pages

| URL | Source file |
| --- | --- |
| `/` | `index.html` — Byteshire home |
| `/discboard/` | `discboard.html` — Discboard landing page |
| `/discboard-privacy/` | `discboard-privacy.md` — Discboard privacy policy |
| `/discboard-terms/` | `discboard-terms.md` — Discboard terms of use |
| `/discboard/tiktok/`, `/discboard/instagram/`, `/discboard/youtube/`, `/discboard/bluesky/`, `/discboard/reddit/` | `discboard/<channel>.md` — short links that forward to the App Store with a campaign token (see below) |

## The legal URLs are load-bearing — do not break them

The Discboard app links to `https://byteshire.com/discboard-privacy` and `https://byteshire.com/discboard-terms` from its paywall, and both appear in the App Store listing. Those paths must keep resolving. They are pinned with `permalink:` in the two legal pages' front matter. GitHub Pages serves the trailing-slash form (`/discboard-privacy/`) and 301-redirects the bare form (`/discboard-privacy`), which browsers and in-app web views follow transparently. Do not rename or remove these pages without updating the app's hardcoded links.

This site is the canonical published home for the legal copy. It originated from `Discboard/docs/PRIVACY.md` and `Discboard/docs/TERMS.md`; once this site is live, those files plus `Discboard/scripts/render_legal.py` and `Discboard/docs/discboard-*.html` can be retired.

## Configuration

`_config.yml` holds Discboard's App Store id (`discboard_app_id`) and its App Analytics provider token (`discboard_campaign_pt`). Every store link on the site is built from those two values plus a campaign token, so App Store Connect → Analytics → Acquisition → Campaigns can attribute installs to the link that produced them. The landing page's download button carries `ct=byteshire-web`.

## Campaign short links

`discboard/<channel>.md` pages use the `redirect` layout and supply only a `campaign:` token; the layout assembles the full `apps.apple.com` URL and forwards immediately. They exist because a short-form video caption cannot be tapped, so the link has to be short enough to say out loud and type — `byteshire.com/discboard/youtube` — and because a redirect can be re-pointed later without editing a post that is already live.

Token convention: TikTok and Instagram only ever get a bio link, so their tokens are evergreen (`bio-tiktok`, `bio-instagram`). YouTube, Bluesky and Reddit links go in individual posts, so their tokens name the release they were posted for (`1.3-carplay-youtube`); bump them when the next release's posts go out. A campaign row only appears in App Store Connect once five distinct Apple Accounts have installed through it.

## Local preview

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. Requires a Homebrew Ruby plus Bundler — the macOS system Ruby is too old. For small edits you can also skip local preview and let GitHub Pages build on push.

## Deploy

Push to the default branch. GitHub Pages builds and publishes automatically. The custom domain comes from the `CNAME` file.
