import type { Plugin } from 'vite'
import matter from 'gray-matter'
import { marked } from 'marked'
import { execSync } from 'child_process'
import path from 'path'

function titleFromFilename(filepath: string): string {
  const name = path.basename(filepath, '.md')
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getGitInfo(filepath: string): { date: string; author: string } {
  const defaults = { date: new Date().toISOString().slice(0, 10), author: 'EXPL.ONE' }
  try {
    const result = execSync(
      `git log --follow --diff-filter=A --format="%aI|%aN" -- "${filepath}"`,
      { encoding: 'utf-8', timeout: 5000 }
    ).trim()
    if (!result) return defaults
    const last = result.split('\n').pop()!
    const [dateStr, author] = last.split('|')
    return {
      date: dateStr ? dateStr.slice(0, 10) : defaults.date,
      author: author || defaults.author,
    }
  } catch {
    return defaults
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
      const git = getGitInfo(id)
      const date = frontmatter.date || git.date
      const author = frontmatter.author || git.author
      const excerpt = frontmatter.excerpt || extractExcerpt(html)

      const meta = { title, date, author, excerpt }

      return {
        code: `export const frontmatter = ${JSON.stringify(meta)};
export const html = ${JSON.stringify(html)};
export default { frontmatter, html };`,
        map: null,
      }
    },
  }
}
