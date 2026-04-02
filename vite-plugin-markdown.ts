import type { Plugin } from 'vite'
import matter from 'gray-matter'
import { marked } from 'marked'
import { execSync } from 'child_process'
import path from 'path'

const DEFAULT_AUTHOR = 'G.Orbeliani'
const DEFAULT_AUTHOR_URL = 'https://www.linkedin.com/in/g-orbeliani/'

function titleFromFilename(filepath: string): string {
  const name = path.basename(filepath, '.md')
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getGitDate(filepath: string): string {
  try {
    const result = execSync(
      `git log --follow --diff-filter=A --format="%aI" -- "${filepath}"`,
      { encoding: 'utf-8', timeout: 5000 }
    ).trim()
    if (!result) return new Date().toISOString().slice(0, 10)
    const last = result.split('\n').pop()!
    return last.slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function extractExcerpt(html: string, maxLen = 160): string {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s\S*$/, '') + '...'
}

export default function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    enforce: 'pre',

    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { data: frontmatter, content } = matter(code)
      const html = marked.parse(content, { async: false }) as string

      const title = frontmatter.title || titleFromFilename(id)
      const date = frontmatter.date || getGitDate(id)
      const author = frontmatter.author || DEFAULT_AUTHOR
      const authorUrl = frontmatter.authorUrl || DEFAULT_AUTHOR_URL
      const excerpt = frontmatter.excerpt || extractExcerpt(html)

      const meta = { title, date, author, authorUrl, excerpt }

      return {
        code: `export const frontmatter = ${JSON.stringify(meta)};
export const html = ${JSON.stringify(html)};
export default { frontmatter, html };`,
        map: null,
      }
    },
  }
}
