# ONE Blog

The open blog of the [EXPL.ONE](https://expl.one) ecosystem at [blog.expl.one](https://blog.expl.one).

Articles, insights, and perspectives from the community. Dev updates, tech reviews, event recaps, ecosystem vision, Web3 thoughts, anything. Open topics, open contributions.

## Writing an Article

Just create a `.md` file in the `content/` folder and push. Everything else is automatic.

### File naming

Use underscores for spaces. The filename becomes the article title and URL slug:

```
content/getting_started_with_one_chain.md
```

- **Title** (auto): "Getting Started With One Chain"
- **URL** (auto): `/article/getting-started-with-one-chain`
- **Date** (auto): taken from the git commit that added the file (UTC)
- **Author** (auto): GitHub username of the committer, linked to their profile
- **Excerpt** (auto): first 160 characters of the article body

### Cover image

Place a cover image in `content/media/` with the same name as your `.md` file:

```
content/getting_started_with_one_chain.md       <- article
content/media/getting_started_with_one_chain.jpg  <- cover
```

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`. If no cover is found, a gradient placeholder is used.

### Article body

Write standard Markdown. No frontmatter required. Just start writing:

```markdown
This is the first paragraph of my article. It will be used as the
excerpt on the article listing page.

## A Section Heading

More content here...

- Bullet points work
- **Bold** and *italic* too
- `code` and code blocks

> Blockquotes for emphasis

![Alt text](https://example.com/image.png)
```

### Optional frontmatter

If you want to override any auto-detected field, add frontmatter at the top of your `.md`:

```markdown
---
title: "Custom Title That Differs From Filename"
date: "2026-01-15"
author: "SomeOtherUsername"
excerpt: "A custom excerpt instead of auto-extracted."
---

Article body...
```

All frontmatter fields are optional. Omit any field to use the automatic value.

## Contributing an Article

Anyone can submit an article to ONE Blog:

1. **Fork** this repository
2. Create your `.md` file in `content/` (and optionally a cover in `content/media/`)
3. Open a **Pull Request**
4. Once reviewed and merged, your article goes live automatically

Your GitHub username is automatically detected as the author and linked to your profile. No setup needed.

## Development

```bash
bun install
bun run dev        # Dev server at http://localhost:5173
bun run build      # Production build
bun run preview    # Preview production build
```

## Tech

Built with React, TypeScript, Vite, and Tailwind CSS. Part of the [EXPL.ONE](https://expl.one) ecosystem.

## License

MIT
