// Copies files that live at the repo root into the built site, byte for byte.
//
// Why not public/: Discboard's scripts/publish_board.py writes promo boards
// into this repo at discboards/<slug>/ and b/<slug>/, and refuses to run
// unless .well-known/ sits at the repo root. Keeping those folders where the
// script expects them means it keeps working unchanged. This integration
// copies everything in them except the index.html pages, which Astro renders
// from their front matter (see src/content.config.ts).
//
// Symlinks are followed: b/<slug>/board.discboardboard is a symlink to the
// real board file, and the built site must serve the file itself, because
// Discboard 1.3.1 downloads it from that path.
import { cp, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT_FOLDERS = [".well-known", "discboards", "b"];
const ROOT_FILES = ["CNAME"];
const RENDERED = new Set(["index.html", ".DS_Store"]);

async function copyTree(from, to) {
  for (const entry of await readdir(from)) {
    if (RENDERED.has(entry)) continue;
    const source = path.join(from, entry);
    const target = path.join(to, entry);
    if ((await stat(source)).isDirectory()) {
      await copyTree(source, target);
    } else {
      await cp(source, target, { dereference: true, force: true });
    }
  }
}

export default function passthrough() {
  return {
    name: "byteshire-passthrough",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        for (const folder of ROOT_FOLDERS) {
          await copyTree(folder, path.join(out, folder));
        }
        for (const file of ROOT_FILES) {
          await cp(file, path.join(out, file), { force: true });
        }
        logger.info(`copied ${ROOT_FOLDERS.join(", ")} and ${ROOT_FILES.join(", ")}`);
      },
    },
  };
}
