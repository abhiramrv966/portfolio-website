---
title: How this blog works
date: 2026-10-02
summary: Posts are Markdown files in the posts folder. This one doubles as a formatting reference — delete it, or set it to draft, before publishing the site.
tags: guide
draft: false
---

Every post on this site is a Markdown file in the `posts/` folder. The file name is the post's address: `posts/how-this-blog-works.md` is served at `blog.html?p=how-this-blog-works`.

## Adding a post

1. From the site folder, run `python new_post.py "Your title"`. It creates `posts/your-title.md` with the header filled in, marked as a draft, and registers it in `posts/index.json`.
2. Write the post below the header.
3. Preview it at `blog.html?p=your-title` while the local server is running. Drafts open by their link but stay out of every list.
4. Change `draft: true` to `draft: false` to publish it on the blog page and in the Writing section of the home page.

To add a post by hand instead, create the file and add its name, without `.md`, to the list in `posts/index.json`.

## The header

Each file starts with a short header between two `---` lines:

```yaml
---
title: Evaluating retrieval with nDCG
date: 2026-10-02
summary: One or two sentences shown in the post list.
tags: retrieval, evaluation
draft: false
---
```

| Field | Purpose |
| --- | --- |
| `title` | Post title |
| `date` | Publication date as `YYYY-MM-DD`; lists are sorted newest first |
| `summary` | Shown under the title in lists, and used as the page description |
| `tags` | Comma-separated; each tag becomes a filter on the blog page |
| `draft` | `true` keeps the post out of lists; its link still works for previewing |

## Formatting

Standard Markdown works: **bold**, *italics*, [links](https://commonmark.org/help/), `inline code`, numbered and bulleted lists, tables and images.

> Block quotes render with an accent rule — useful for a key result or a definition.

Code blocks are highlighted when the language is named after the opening fence:

```python
from sklearn.metrics import roc_auc_score

def evaluate(model, X_test, y_test):
    """ROC-AUC on held-out data."""
    scores = model.predict_proba(X_test)[:, 1]
    return roc_auc_score(y_test, scores)
```

Images go in `posts/images/` and are referenced relative to the post, so they also show in your editor's Markdown preview:

```markdown
![Calibration curve on the held-out set](images/calibration.png)
```

## Equations

LaTeX maths is rendered with KaTeX. Wrap inline maths in single dollar signs: the area under the ROC curve is $\mathrm{AUC} = \int_0^1 \mathrm{TPR}\,\mathrm{d}(\mathrm{FPR})$, and a model that ranks at random scores $0.5$.

Put display equations between `$$` lines, each on a line of its own:

$$
\mathrm{nDCG@}k = \frac{1}{\mathrm{IDCG@}k} \sum_{i=1}^{k} \frac{2^{\mathrm{rel}_i} - 1}{\log_2(i + 1)}
$$

Numbered equations use `\tag`:

$$
\mathcal{L}(\theta) = -\frac{1}{N} \sum_{n=1}^{N} \sum_{c=1}^{C} y_{n,c} \log p_\theta(c \mid x_n) \tag{1}
$$

The source for the inline example and the first display equation:

```markdown
the area under the ROC curve is $\mathrm{AUC} = \int_0^1 \mathrm{TPR}\,\mathrm{d}(\mathrm{FPR})$

$$
\mathrm{nDCG@}k = \frac{1}{\mathrm{IDCG@}k} \sum_{i=1}^{k} \frac{2^{\mathrm{rel}_i} - 1}{\log_2(i + 1)}
$$
```

A closing `$` must be followed by a space, punctuation or the end of the line, so prices such as $5 or $20 stay as plain text. Write `\$` for a literal dollar sign next to maths. The `\( … \)` and `\[ … \]` delimiters are not recognised; use dollar signs instead. Maths renders in the post body, not in titles or summaries.

Reading time is estimated from the word count, at about 220 words per minute.
