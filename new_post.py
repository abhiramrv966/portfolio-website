"""Create a new blog post as a draft.

    python new_post.py "Evaluating retrieval with nDCG"

Creates posts/evaluating-retrieval-with-ndcg.md with the header filled in and adds it
to posts/index.json. Preview it at blog.html?p=<slug>; set `draft: false` to publish.
"""
import datetime
import json
import pathlib
import re
import sys

POSTS = pathlib.Path(__file__).resolve().parent / "posts"


def main() -> None:
    title = " ".join(sys.argv[1:]).strip() or input("Title: ").strip()
    if not title:
        sys.exit("A title is required.")
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    if not slug:
        sys.exit("The title needs at least one letter or digit.")

    POSTS.mkdir(exist_ok=True)
    path = POSTS / f"{slug}.md"
    if path.exists():
        sys.exit(f"posts/{path.name} already exists.")

    path.write_text(
        "---\n"
        f"title: {title}\n"
        f"date: {datetime.date.today().isoformat()}\n"
        "summary: One or two sentences shown in the post list.\n"
        "tags: \n"
        "draft: true\n"
        "---\n\n"
        "Start writing here.\n",
        encoding="utf-8",
    )

    index = POSTS / "index.json"
    slugs = json.loads(index.read_text(encoding="utf-8")) if index.exists() else []
    if slug not in slugs:
        slugs.insert(0, slug)
    index.write_text(json.dumps(slugs, indent=2) + "\n", encoding="utf-8")

    print(f"Created posts/{slug}.md (draft)")
    print(f"Preview: http://localhost:4173/blog.html?p={slug}")
    print("Set 'draft: false' in its header to publish it.")


if __name__ == "__main__":
    main()
