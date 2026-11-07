#!/usr/bin/env python3
"""Import one app's listing copy, What's New history and art into this repo.

Usage: scripts/import-app.py <slug> [--source-root ~/Source]

Reads the app's MARKETING.md and Koubou screenshots (locations in
scripts/app-sources.json) and writes:

    src/content/listings/<slug>.json   subtitle, promotional text, description blocks
    src/content/releases/<slug>.json   shipped App Store versions and their What's New
    src/assets/apps/<slug>/            icon, link-preview image, screenshots (resized)
    public/fonts/<slug>/               the app's brand typeface and its license

Everything it writes is generated: change the source in the app's repo and run
this again, never edit the output by hand (SPEC › Principles). It runs on the
user's Mac, where the sibling repos live; the deploy only reads its output.

A What's New block counts as shipped when MARKETING.md marks it "(shipped)", or
when its version is the one Apple's lookup endpoint says is live now.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent


def fail(message):
    print(f"FATAL: {message}", file=sys.stderr)
    sys.exit(1)


def section(markdown, heading):
    """The text under a '## heading', up to the next '## '."""
    match = re.search(rf"^## {re.escape(heading)}\n(.*?)(?=^## |\Z)", markdown, re.S | re.M)
    if not match:
        fail(f"MARKETING.md has no '## {heading}' section")
    return match.group(1)


def first_fence(text, after=None):
    """The first fenced block in text, optionally after a marker line."""
    if after:
        index = text.find(after)
        if index < 0:
            fail(f"marker {after!r} not found")
        text = text[index:]
    match = re.search(r"^```\n(.*?)\n```", text, re.S | re.M)
    if not match:
        fail(f"no fenced block found{' after ' + after if after else ''}")
    return match.group(1)


def blocks(plain):
    """Plain App Store text → paragraphs and bullet lists."""
    out = []
    for chunk in re.split(r"\n\s*\n", plain.strip()):
        lines = [line.rstrip() for line in chunk.splitlines() if line.strip()]
        # A short first line with no closing punctuation, followed by more text,
        # is a section heading ("Repeat", "Also in 2.1.1").
        if len(lines) > 1 and len(lines[0]) <= 48 and not re.search(r"[.!?:,]$", lines[0]):
            out.append({"type": "h", "text": lines.pop(0)})
        paragraph, items = [], []
        for line in lines:
            if line.startswith("• "):
                if paragraph:
                    out.append({"type": "p", "text": " ".join(paragraph)})
                    paragraph = []
                items.append(line[2:].strip())
            else:
                if items:
                    out.append({"type": "ul", "items": items})
                    items = []
                paragraph.append(line)
        if paragraph:
            # A short line followed by more text is a heading ("Repeat", "Also in 2.1.1").
            out.append({"type": "p", "text": " ".join(paragraph)})
        if items:
            out.append({"type": "ul", "items": items})
    return out


def live_version(app_store_id):
    url = f"https://itunes.apple.com/lookup?id={app_store_id}"
    with urllib.request.urlopen(url, timeout=20) as response:
        if response.status != 200:
            fail(f"lookup returned HTTP {response.status} for {url}")
        results = json.load(response).get("results", [])
    if not results:
        fail(f"lookup found no app with id {app_store_id}")
    return results[0]


def releases(markdown, live):
    text = section(markdown, "What's New")
    headings = list(re.finditer(r"^\*\*(?:Draft|Previous)[^v*]*v([\d.]+)[^*]*\*\*", text, re.M))
    versions = []
    for index, heading in enumerate(headings):
        end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
        body = text[heading.start():end]
        version = heading.group(1)
        shipped = "(shipped)" in heading.group(0) or version == live["version"]
        if not shipped:
            continue
        entry = {"version": version, "blocks": blocks(first_fence(body))}
        if version == live["version"]:
            entry["date"] = live["currentVersionReleaseDate"][:10]
        versions.append(entry)
    if not versions:
        fail("no shipped What's New versions found")
    return versions


def resize(source, target, longest):
    target.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        ["sips", "-Z", str(longest), "-s", "format", "jpeg", "-s", "formatOptions", "85", str(source), "--out", str(target)],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        fail(f"sips could not convert {source}: {result.stderr.strip()}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("slug")
    parser.add_argument("--source-root", default=str(Path.home() / "Source"))
    args = parser.parse_args()

    sources = json.loads((SITE / "scripts/app-sources.json").read_text())
    config = sources.get(args.slug) or fail(f"{args.slug} is not in scripts/app-sources.json")
    root = Path(args.source_root).expanduser()
    repo, assets = root / config["repo"], root / config["assets"]
    for path in (repo / "MARKETING.md", assets):
        if not path.exists():
            fail(f"{path} not found")

    markdown = (repo / "MARKETING.md").read_text(encoding="utf-8")
    live = live_version(config["appStoreId"])

    listing = {
        "subtitle": first_fence(section(markdown, "Subtitle")),
        "promotionalText": first_fence(section(markdown, "Promotional Text")),
        "description": blocks(first_fence(section(markdown, "Description"))),
    }
    release_list = {"liveVersion": live["version"], "versions": releases(markdown, live)}

    for folder, data in (("listings", listing), ("releases", release_list)):
        out = SITE / "src/content" / folder / f"{args.slug}.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {out.relative_to(SITE)}")

    art = SITE / "src/assets/apps" / args.slug
    if art.exists():
        shutil.rmtree(art)
    # The icon as the App Store shows it, rendered by Apple, when the app is live.
    # Icon Composer bundles hold layers, not a flat image, so this is the
    # reliable source; an app not on the store yet uses its configured file.
    icon_url = live.get("artworkUrl512", "").replace("512x512bb", "1024x1024bb")
    if icon_url:
        downloaded = art / "icon-source.png"
        art.mkdir(parents=True, exist_ok=True)
        with urllib.request.urlopen(icon_url, timeout=30) as response:
            if response.status != 200:
                fail(f"icon download returned HTTP {response.status} for {icon_url}")
            downloaded.write_bytes(response.read())
        resize(downloaded, art / "icon.jpg", 512)
        downloaded.unlink()
    else:
        resize(assets / config["icon"], art / "icon.jpg", 512)
    resize(assets / config["ogImage"], art / "og.jpg", 1600)
    count = 0
    for device, folder in config["screenshots"].items():
        shots = sorted((assets / folder).glob("[0-9][0-9]_*.png"))
        if not shots:
            fail(f"no numbered screenshots in {assets / folder}")
        longest = 1400
        for shot in shots:
            resize(shot, art / "screens" / device / f"{shot.stem}.jpg", longest)
            count += 1
    print(f"wrote {count} screenshots, the icon and the link-preview image to {art.relative_to(SITE)}")

    fonts = SITE / "public/fonts" / args.slug
    fonts.mkdir(parents=True, exist_ok=True)
    for key in ("file", "license"):
        shutil.copy2(assets / config["font"][key], fonts / Path(config["font"][key]).name)
    print(f"copied {config['font']['family']} to {fonts.relative_to(SITE)}")


if __name__ == "__main__":
    main()
