// An RSS feed of an app's App Store versions, one item per version.
import type { APIRoute, GetStaticPaths } from "astro";
import { appsWithPages } from "../../../lib/app-pages";

export const getStaticPaths: GetStaticPaths = async () =>
  (await appsWithPages()).map(({ app, releases }) => ({ params: { app: app.id }, props: { app, releases } }));

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Props = Awaited<ReturnType<typeof appsWithPages>>[number];

export const GET: APIRoute<Props> = ({ props, site }) => {
  const { app, releases } = props;
  const page = new URL(`/${app.id}/whats-new/`, site);
  const items = releases.versions.map((release) => {
    const html = release.blocks
      .map((block) =>
        block.type === "ul"
          ? `<ul>${block.items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`
          : block.type === "h"
            ? `<h3>${escape(block.text)}</h3>`
            : `<p>${escape(block.text)}</p>`,
      )
      .join("");
    const link = `${page}#v${release.version}`;
    return [
      "<item>",
      `<title>${escape(`${app.data.name} ${release.version}`)}</title>`,
      `<link>${link}</link>`,
      `<guid isPermaLink="true">${link}</guid>`,
      release.date ? `<pubDate>${release.date.toUTCString()}</pubDate>` : "",
      `<description>${escape(html)}</description>`,
      "</item>",
    ].join("");
  });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    `<title>${escape(`${app.data.name} — What’s New`)}</title>`,
    `<link>${page}</link>`,
    `<description>${escape(`Every version of ${app.data.name} on the App Store.`)}</description>`,
    "<language>en</language>",
    ...items,
    "</channel></rss>",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
