// Blog data. Each post is a Markdown file in ./posts with a short header:
//
//   ---
//   title: Post title
//   date: 2026-10-02
//   summary: One or two sentences for lists.
//   tags: agents, evaluation
//   draft: false
//   ---
//
// ./posts/index.json lists the file names (without .md) that belong to the blog.

const POSTS = new URL("./posts/", import.meta.url);
const SLUG = /^[a-z0-9][a-z0-9-]*$/i;

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function parse(text) {
  const m = text.match(/^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  const meta = {};
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i < 1) continue;
      let v = line.slice(i + 1).trim();
      if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
      meta[line.slice(0, i).trim().toLowerCase()] = v;
    }
  }
  return { meta, body: m ? text.slice(m[0].length) : text };
}

export const postsBase = POSTS;

export async function loadPost(slug) {
  if (!SLUG.test(slug)) throw new Error("not-found");
  const res = await fetch(new URL(`${slug}.md`, POSTS), { cache: "no-cache" });
  if (!res.ok) throw new Error("not-found");
  const { meta, body } = parse(await res.text());
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    body,
    title: meta.title || slug.replace(/-/g, " "),
    date: meta.date || "",
    summary: meta.summary || "",
    tags: (meta.tags || "")
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((t) => t.trim().replace(/^(["'])(.*)\1$/, "$2"))
      .filter(Boolean),
    draft: /^(true|yes)$/i.test(meta.draft || ""),
    minutes: Math.max(1, Math.round(words / 220)),
  };
}

// Published posts, newest first. Posts that fail to load are skipped.
export async function loadPosts({ drafts = false } = {}) {
  const res = await fetch(new URL("index.json", POSTS), { cache: "no-cache" });
  if (!res.ok) throw new Error("no-index");
  const slugs = await res.json();
  const settled = await Promise.allSettled(slugs.map(loadPost));
  return settled
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((p) => drafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return iso || "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(+m[1], m[2] - 1, +m[3]));
}

// One row in a post list (home page "Writing" and blog.html share this markup).
export function postRowHTML(p, i = 0) {
  const meta = `${p.minutes} min read${p.tags.length ? " · " + p.tags.map(esc).join(", ") : ""}`;
  return `<li class="post-row reveal" data-reveal style="--d:${i * 90}ms;--y:32px">
    <a class="post-row__link" href="blog.html?p=${encodeURIComponent(p.slug)}">
      <span class="post-row__date label">${esc(formatDate(p.date))}</span>
      <span class="post-row__main">
        <span class="post-row__title">${esc(p.title)}</span>
        ${p.summary ? `<span class="post-row__summary">${esc(p.summary)}</span>` : ""}
      </span>
      <span class="post-row__meta label">${meta}</span>
      <span class="post-row__arrow" aria-hidden="true">↗</span>
    </a>
  </li>`;
}
