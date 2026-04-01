import type { BlogPost, MarkdownModule } from '@/types/blog'

const modules = import.meta.glob<MarkdownModule>('/content/*.md', { eager: true })

const coverFiles = import.meta.glob('/content/media/*', { eager: true, query: '?url', import: 'default' })

function resolvecover(filename: string): string | null {
  const base = `/content/media/${filename}`
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const key = base + ext
    if (key in coverFiles) return coverFiles[key] as string
  }
  return null
}

function slugFromPath(path: string): string {
  const filename = path.split('/').pop()!.replace(/\.md$/, '')
  return filename.replace(/_/g, '-')
}

function filenameFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const filename = filenameFromPath(path)
      return {
        slug: slugFromPath(path),
        frontmatter: mod.frontmatter,
        html: mod.html,
        coverPath: resolvecover(filename),
        readingTime: estimateReadingTime(mod.html),
      }
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  for (const post of getAllPosts()) {
    post.frontmatter.tags?.forEach((t) => tags.add(t))
  }
  return Array.from(tags).sort()
}
