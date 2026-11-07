import { getCollection, getEntry, type CollectionEntry } from "astro:content";

// Apps that get the full page set (landing, What's New, support): those with a
// landing page and an imported release history.
export async function appsWithPages() {
  const apps = (await getCollection("apps")).filter((app) => app.data.landingPage);
  const withReleases = [];
  for (const app of apps) {
    const releases = await getEntry("releases", app.id);
    if (releases) withReleases.push({ app, releases: releases.data });
  }
  return withReleases;
}

export const longDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

type Release = CollectionEntry<"releases">["data"]["versions"][number];

// A release's notes, or a line saying it was the first, since App Store Connect
// has no What's New field for an app's first version. The page and the feed share it.
export const releaseNotes = (release: Release, appName: string) =>
  release.blocks.length > 0 ? release.blocks : [{ type: "p" as const, text: `The first release of ${appName}.` }];
