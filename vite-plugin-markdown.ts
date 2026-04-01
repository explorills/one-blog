import type { Plugin } from 'vite'
import matter from 'gray-matter'
import { marked } from 'marked'
import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

let authorsMap: Record<string, string> | null = null

function loadAuthorsMap(root: string): Record<string, string> {
  if (authorsMap !== null) return authorsMap
  const authorsPath = path.join(root, 'content', '.authors.json')
  if (existsSync(authorsPath)) {
    try {
      authorsMap = JSON.parse(readFileSync(authorsPath, 'utf-8'))
      return authorsMap!
    } catch { /* fall through */ }
  }
  authorsMap = {}
  return authorsMap
}

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
  let root = process.cwd()

  return {
    name: 'vite-plugin-markdown',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
    },

    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { data: frontmatter, content } = matter(code)
      const html = marked.parse(content, { async: false }) as string

      const title = frontmatter.title || titleFromFilename(id)
      const git = getGitInfo(id)
      const date = frontmatter.date || git.date

      // Author resolution: .authors.json (CI) > frontmatter > git fallback
      const authors = loadAuthorsMap(root)
      const filename = path.basename(id)
      const author = frontmatter.author || authors[filename] || git.author

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
