import type { CollectionEntry } from "astro:content";

type Block = CollectionEntry<"listings">["data"]["description"][number];

// The App Store description, divided the way a landing page shows it: the
// story told before the first list, the feature list, and everything after
// (the free tier, Premium and the subscription disclosure).
export function divideDescription(description: Block[]) {
  const firstList = description.findIndex((block) => block.type === "ul");
  if (firstList < 0) return { story: description, features: [], rest: [] };
  const list = description[firstList];
  return {
    story: description.slice(0, firstList),
    features: list.type === "ul" ? list.items.map(splitFeature) : [],
    rest: description.slice(firstList + 1).map(withoutBareLegalURLs),
  };
}

// The App Store needs the Terms and Privacy URLs spelled out in plain text; a
// web page links them instead, so the spelled-out copies are dropped.
function withoutBareLegalURLs(block: Block): Block {
  if (block.type === "ul") return block;
  return { ...block, text: block.text.replace(/\s*(Terms of Use|Privacy Policy): https?:\/\/\S+/g, "") };
}

// "Lay your covers out however you like — drag with one finger…" becomes a
// short title and its explanation. A bullet with no dash is all title.
export function splitFeature(item: string): { title: string; body?: string } {
  const [title, ...rest] = item.split(" — ");
  const body = rest.join(" — ");
  return body ? { title, body: body.charAt(0).toUpperCase() + body.slice(1) } : { title };
}

// "iPhone, iPad, Mac, and Apple Watch"
export function platformList(platforms: string[]): string {
  if (platforms.length < 3) return platforms.join(" and ");
  return `${platforms.slice(0, -1).join(", ")}, and ${platforms.at(-1)}`;
}

// The App Store description split at its section headings, for a page that
// places each section in its own part of the design. `intro` is what comes
// before the first heading. Spelled-out legal URLs are dropped, as above.
export function listingSections(description: Block[]) {
  const intro: Block[] = [];
  const sections = new Map<string, Block[]>();
  let current = intro;
  for (const block of description) {
    if (block.type === "h") {
      current = [];
      sections.set(block.text, current);
    } else {
      current.push(withoutBareLegalURLs(block));
    }
  }
  const section = (heading: string) => {
    const blocks = sections.get(heading);
    if (!blocks) throw new Error(`The listing has no "${heading}" section`);
    return blocks;
  };
  return { intro, section };
}

// The text of a section's first paragraph.
export function firstParagraph(blocks: Block[]) {
  const block = blocks.find((b) => b.type === "p");
  return block?.type === "p" ? block.text : "";
}

// The items of a section's first list.
export function firstList(blocks: Block[]) {
  const block = blocks.find((b) => b.type === "ul");
  return block?.type === "ul" ? block.items : [];
}
