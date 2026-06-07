# byteshire-web

The static website for [byteshire.com](https://byteshire.com) and the Discboard product pages. Built with Jekyll and served by GitHub Pages — no build step or GitHub Action to maintain, because GitHub Pages compiles Jekyll natively on every push.

## Pages

| URL | Source file |
| --- | --- |
| `/` | `index.html` — Byteshire home |
| `/discboard/` | `discboard.html` — Discboard landing page |
| `/discboard-privacy/` | `discboard-privacy.md` — Discboard privacy policy |
| `/discboard-terms/` | `discboard-terms.md` — Discboard terms of use |

## The legal URLs are load-bearing — do not break them

The Discboard app links to `https://byteshire.com/discboard-privacy` and `https://byteshire.com/discboard-terms` from its paywall, and both appear in the App Store listing. Those paths must keep resolving. They are pinned with `permalink:` in the two legal pages' front matter. GitHub Pages serves the trailing-slash form (`/discboard-privacy/`) and 301-redirects the bare form (`/discboard-privacy`), which browsers and in-app web views follow transparently. Do not rename or remove these pages without updating the app's hardcoded links.

This site is the canonical published home for the legal copy. It originated from `Discboard/docs/PRIVACY.md` and `Discboard/docs/TERMS.md`; once this site is live, those files plus `Discboard/scripts/render_legal.py` and `Discboard/docs/discboard-*.html` can be retired.

## Configuration

`_config.yml` holds `discboard_app_store_url`. It is currently `"#"`; set it to the real App Store URL once Discboard is live, and the "Download on the App Store" button picks it up.

## Local preview

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. Requires a Homebrew Ruby plus Bundler — the macOS system Ruby is too old. For small edits you can also skip local preview and let GitHub Pages build on push.

## Deploy

Push to the default branch. GitHub Pages builds and publishes automatically. The custom domain comes from the `CNAME` file.
