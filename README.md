# portfolio-website

Personal site and blog of Abhiram R Vishwakarma. Plain HTML, CSS and JavaScript — no build step.

- `index.html` — the one-page portfolio
- `blog.html` — blog list and post pages
- `posts/` — blog posts as Markdown, listed in `posts/index.json`
- `blog-data.js` — loads and parses posts for both pages

## Run locally

Posts load over HTTP, so serve the folder rather than opening the files directly:

```bash
python -m http.server 4173
```

Then open http://localhost:4173.

## Write a post

```bash
python new_post.py "Your post title"
```

This creates `posts/your-post-title.md` as a draft and registers it in `posts/index.json`. Preview it at `blog.html?p=your-post-title`, then set `draft: false` in its header to publish. Maths is written in LaTeX between `$…$` or `$$` lines. `posts/how-this-blog-works.md` documents the format.
