import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock } from '@phosphor-icons/react'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types/blog'

const ease = [0.22, 1, 0.36, 1] as const

export function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
      }}
    >
      <Link
        to={`/article/${post.slug}`}
        className="group block rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-card/50 hover:shadow-[0_0_30px_oklch(0.68_0.14_65_/_0.06)]"
      >
        {/* Cover image */}
        <div className="aspect-[16/9] overflow-hidden bg-muted/30">
          {post.coverPath ? (
            <img
              src={post.coverPath}
              alt={post.frontmatter.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.12 0.02 65), oklch(0.08 0.015 55))',
              }}
            >
              <span
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50"
                style={{ fontFamily: "'Roboto Mono', monospace" }}
              >
                ONE Blog
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Meta */}
          <div
            className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2.5"
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            <time>{formatDate(post.frontmatter.date)}</time>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1">
              <Clock weight="regular" className="w-3 h-3" />
              {post.readingTime} min
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors duration-200">
            {post.frontmatter.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.frontmatter.excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
