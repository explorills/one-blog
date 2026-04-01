export interface BlogPostFrontmatter {
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
}

export interface BlogPost {
  slug: string
  frontmatter: BlogPostFrontmatter
  html: string
  coverPath: string | null
  readingTime: number
}

export interface MarkdownModule {
  frontmatter: BlogPostFrontmatter
  html: string
}
