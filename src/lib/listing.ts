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
