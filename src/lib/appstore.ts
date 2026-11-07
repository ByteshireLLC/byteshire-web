import type { CollectionEntry } from "astro:content";

// The one place an App Store link is built. Every link carries the app's
// provider token and a campaign token, so App Store Connect → Analytics →
// Acquisition → Campaigns can attribute installs to the link that produced them.
export function appStoreURL(app: CollectionEntry<"apps">, campaign: string): string {
  const store = app.data.appStore;
  if (!store) throw new Error(`${app.id} has no appStore entry, so it has no store link`);
  return `https://apps.apple.com/app/id${store.id}?pt=${store.providerToken}&ct=${encodeURIComponent(campaign)}&mt=8`;
}
