/// <reference types="vite/client" />

declare module '*.md' {
  export const frontmatter: Record<string, unknown>
  export const html: string
  const mod: { frontmatter: Record<string, unknown>; html: string }
  export default mod
}
