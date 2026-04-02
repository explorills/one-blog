/**
 * Post-build script: generates per-article HTML files with Open Graph meta tags
 * so social crawlers (Discord, Twitter, etc.) see proper share cards.
 *
 * Reads content/*.md, extracts metadata, creates dist/article/<slug>/index.html
 * with OG tags injected. Also updates dist/index.html with default blog OG tags.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'

const SITE_URL = 'https://blog.expl.one'
const SITE_NAME = 'ONE Blog'
const SITE_DESCRIPTION = 'Articles, insights, and perspectives from the EXPL.ONE community.'
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`

const CONTENT_DIR = join(import.meta.dir, '..', 'content')
const DIST_DIR = join(import.meta.dir, '..', 'dist')

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/_/g, '-')
}

function extractExcerpt(content: string, maxLen = 160): string {
  const text = content.replace(/^#.*$/gm, '').replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_~`>#-]/g, '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s\S*$/, '') + '...'
}

function findCover(filename: string): string | null {
  const base = filename.replace(/\.md$/, '')
  const mediaDir = join(CONTENT_DIR, 'media')
  for (const ext of ['.webp', '.jpg', '.jpeg', '.png']) {
    if (existsSync(join(mediaDir, base + ext))) {
      return `${SITE_URL}/content/media/${base}${ext}`
    }
  }
  return null
}

function buildOgTags(opts: { title: string; description: string; url: string; image: string; type: string }): string {
  return `
    <!-- Open Graph -->
    <meta property="og:title" content="${opts.title}" />
    <meta property="og:description" content="${opts.description}" />
    <meta property="og:image" content="${opts.image}" />
    <meta property="og:url" content="${opts.url}" />
    <meta property="og:type" content="${opts.type}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${opts.title}" />
    <meta name="twitter:description" content="${opts.description}" />
    <meta name="twitter:image" content="${opts.image}" />`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Read the built index.html as template
const indexHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8')

// 1. Update dist/index.html with default blog OG tags
const defaultOg = buildOgTags({
  title: `${SITE_NAME} — EXPL.ONE Ecosystem`,
  description: escapeHtml(SITE_DESCRIPTION),
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  type: 'website',
})
const defaultHtml = indexHtml.replace('</head>', `${defaultOg}\n  </head>`)
writeFileSync(join(DIST_DIR, 'index.html'), defaultHtml)
console.log('✓ Updated dist/index.html with default OG tags')

// 2. Generate per-article HTML files
const mdFiles = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))

for (const file of mdFiles) {
  const raw = readFileSync(join(CONTENT_DIR, file), 'utf-8')
  const { data: fm, content } = matter(raw)

  const title = fm.title || titleFromFilename(file)
  const excerpt = fm.excerpt || extractExcerpt(content)
  const slug = slugFromFilename(file)
  const cover = findCover(file) || DEFAULT_IMAGE
  const articleUrl = `${SITE_URL}/article/${slug}`

  const ogTags = buildOgTags({
    title: escapeHtml(title),
    description: escapeHtml(excerpt),
    url: articleUrl,
    image: cover,
    type: 'article',
  })

  const articleHtml = indexHtml
    .replace('<title>ONE Blog — EXPL.ONE Ecosystem</title>', `<title>${escapeHtml(title)} — ${SITE_NAME}</title>`)
    .replace(
      '<meta name="description" content="Thoughts, updates, and insights from the EXPL.ONE ecosystem." />',
      `<meta name="description" content="${escapeHtml(excerpt)}" />`
    )
    .replace('</head>', `${ogTags}\n  </head>`)

  const articleDir = join(DIST_DIR, 'article', slug)
  mkdirSync(articleDir, { recursive: true })
  writeFileSync(join(articleDir, 'index.html'), articleHtml)
  console.log(`✓ Generated dist/article/${slug}/index.html`)
}

console.log(`\nDone — ${mdFiles.length} article(s) with OG tags`)
