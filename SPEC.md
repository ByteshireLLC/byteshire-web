# byteshire.com — SPEC

Work is tracked in OmniFocus, in the project for this site.

## Who it is for and what it is for

byteshire.com is the public home of Byteshire LLC, a one-person studio making Apple-platform apps. It serves three readers:

- **Someone deciding whether to install an app.** They arrive from the App Store, a social post or a search, and need to see quickly what the app does, what it looks like and where to get it.
- **Apple and the apps themselves.** Every app's App Store listing and in-app paywall link to its privacy, terms and support pages. Those URLs are load-bearing and must never stop resolving.
- **Press and curious visitors.** They want to know who makes these apps and to find logos, screenshots and facts without writing in.

Success means each app has a page as polished as its App Store listing, and every page stays correct as apps ship new versions, without hand-editing HTML.

## Principles

- **Describe each app once, generate everything from it.** One data file per app drives its landing page, its legal and support pages, its tile on the home page, its press entry and its campaign short links. This is the same idea as Koubou for App Store screenshots: declarative config in, branded output out, reproducible on every build.
- **A bad field fails the build.** The per-app data is checked against a schema, so a typo stops the build instead of publishing a broken page.
- **The repo is the source of truth.** Claude designs, builds and maintains the site through a skill that wraps the tooling. Hosted builders that want to own the source, such as v0, Lovable, Framer and Webflow, are ruled out because they would fight with edits made in the repo.
- **Reuse what the app repos already hold.** Listing copy and the App Store What's New history come from each app's `MARKETING.md`, and screenshots from its Koubou output. An import script copies them into this repo, because the deploy runs on GitHub's servers and can't read sibling repos. The copies are never edited by hand: a change is made in the app's repo and imported again, so nothing drifts.
- **Public release notes are App Store versions, not TestFlight builds.** `RELEASE-NOTES.md` is written for testers, one entry per build. Visitors see each shipped version's What's New.
- **Each app's pages wear that app's own brand.** Everything under an app — its landing page, What's New, support and legal pages — uses the colors and typeface from its App Store screenshots, top to bottom, so the site feels like the app's own home. The Byteshire name stays in a small header and footer. Studio pages, such as the home page, keep the neutral Byteshire look. Decided November 2026 with Discboard as the pilot; an app with no brand defined yet falls back to the neutral look.
- **A landing page does what the App Store can't.** The listing is framed, captioned screenshots in fixed slots. An app's page tells the story with motion and with the app's own look and feel: real captures in Apple's device frames, short recordings of the app running, and moments where the page itself behaves like the app, such as Discboard's jewel cases spreading out or flipping open. Repeating the listing's Koubou images is the floor, not the goal.
- **Every landing page is its own design.** There is no shared landing-page template. Each app's page is designed around what is particular to that app, and a design that is perfect for one app would be wrong for another. Discboard's page is "the spread": a stack of jewel cases fans out as the visitor scrolls, the phone rises into the gap, and a case flips open to its track list. Lux Fidelium's page opens before dawn on the icon's own rose window, lit from behind, "light of the faithful", and its light falls into a day of prayer from morning to night, each hour with its own light and a real moment the app is used in. What the apps do share is everything around the landing page: the per-app data, the brand tokens, the device-frame component, the import step, and the What's New, support and legal pages, which stay one design for all. Decided November 2026, after three directions were compared for Discboard.
- **The site never imitates an app's interface.** The app is shown only in real captures. A web page that mimics the app's screens or controls sets expectations the real app may not match, so a page plays with the app's idea and its world, never a copy of its UI. Discboard's jewel cases are the physical objects the app is about, not its controls. Decided November 2026, when a working "Pray Mode" on Lux Fidelium's page was turned down.
- **Sacred things are treated with reverence.** For a prayer app, holy objects and texts are never page mechanics or decoration: no rosary beads as a scroll counter or navigation, no prayer turned into a toy. Lux Fidelium's page draws on its own icon, light and typography instead. Decided November 2026.
- **Follow Apple's marketing rules.** Use only Apple's badge artwork, unmodified, at least 40 px tall with clear space. Show the app in Apple's own device bezels, the latest generation it runs on, unaltered: no tilt, 3D, shadow or reflection, and no copy laid over the device. Captures show the app as it really runs, with fictional data and no real, copyrighted album art.
- **Claude looks before calling it done.** Every change is checked with screenshots at phone and desktop widths in light and dark mode, plus accessibility and performance checks.
- **One brand source.** Colors, type and spacing live in one design-token file, which may also feed ZogUI so the apps and the site share a brand.

## Generator choice and the fallback ladder

The site is being rebuilt on **Astro**, chosen in November 2026 for its schema-checked content collections, its GitHub Pages deploy, its ability to keep exact URLs, and how reliably Claude writes it.

The user's standing instruction is to keep the alternatives in reserve. If Astro hits a showstopper, the work moves to the next tool on this ladder instead of forcing the current one:

1. **Astro**, with Tailwind v4 tokens.
2. **Hugo.** A single binary with no npm, at the cost of no schema checks and Go templates.
3. **A Swift static-site generator**, such as the one behind Sindre Sorhus's site. It must be confirmed as maintained before it is adopted.
4. **Jekyll**, the current generator. It is the last resort, with no schema checks, Ruby, and GitHub Pages frozen on Jekyll 3.10.

Eleventy was ruled out because its owner's 2026 rename and paid tier left its direction unclear.

A showstopper is something that blocks a principle above with no reasonable workaround, such as being unable to keep a load-bearing URL or unable to check each app's data. Friction, a bug with a workaround, or an upgrade chore is not a showstopper. Before moving down the ladder, Claude names the obstacle and the user agrees.

## Hosting

The site stays on GitHub Pages, built by a GitHub Action on each push, with the existing `CNAME`. That keeps the account and DNS as they are. The trade-off is that campaign short links forward with an instant meta-refresh page, not a true permanent redirect. Moving to Cloudflare Pages later would fix that with only a DNS change, so the build config stays free of anything GitHub-specific.

## Load-bearing URLs

The privacy and terms pages for every app, at `/<app>-privacy/` and `/<app>-terms/`, and the campaign short links under `/discboard/<channel>/` must keep resolving through any rebuild. The README explains why. Any migration lists every live URL first and fails its build if one goes missing.
