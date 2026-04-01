import type { Plugin } from 'vite'
import matter from 'gray-matter'
import { marked } from 'marked'

export default function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    enforce: 'pre',

    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { data: frontmatter, content } = matter(code)
      const html = marked.parse(content, { async: false }) as string

      return {
        code: `export const frontmatter = ${JSON.stringify(frontmatter)};
export const html = ${JSON.stringify(html)};
export default { frontmatter, html };`,
        map: null,
      }
    },
  }
}
