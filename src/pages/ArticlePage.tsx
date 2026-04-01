import { useParams, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, GithubLogo } from '@phosphor-icons/react'
import { ArticleContent } from '@/components/blog/ArticleContent'
import { getPostBySlug } from '@/lib/blog'
import { formatDate } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  useEffect(() => {
    if (post) {
      document.title = `${post.frontmatter.title} — ONE Blog`
    }
    return () => {
      document.title = 'ONE Blog — EXPL.ONE Ecosystem'
    }
  }, [post])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) return <Navigate to="/404" replace />

  const authorGithubUrl = `https://github.com/${post.frontmatter.author}`

  return (
    <article>
      {/* Cover */}
      <div className="relative w-full max-h-[420px] overflow-hidden">
        {post.coverPath ? (
          <motion.img
            src={post.coverPath}
            alt={post.frontmatter.title}
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease }}
            className="w-full h-[320px] sm:h-[380px] md:h-[420px] object-cover"
          />
        ) : (
          <div
            className="w-full h-[240px] sm:h-[300px]"
            style={{
              background: 'linear-gradient(135deg, oklch(0.12 0.03 65), oklch(0.06 0.015 55))',
            }}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[oklch(0.06_0.012_55)] to-transparent" />
      </div>

      {/* Article header */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
          className="-mt-12 relative z-10"
        >
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors mb-5"
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
            All articles
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-bold tracking-tight leading-[1.15] mb-4">
            {post.frontmatter.title}
          </h1>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-[12px] text-muted-foreground mb-8"
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            <time>{formatDate(post.frontmatter.date)}</time>
            <span className="w-px h-3 bg-border" />
            <a
              href={authorGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
            >
              <GithubLogo weight="regular" className="w-3 h-3" />
              {post.frontmatter.author}
            </a>
            <span className="w-px h-3 bg-border" />
            <span className="flex items-center gap-1">
              <Clock weight="regular" className="w-3 h-3" />
              {post.readingTime} min read
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border/50 mb-8" />

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="pb-16"
        >
          <ArticleContent html={post.html} />

          {/* Bottom back link */}
          <div className="mt-12 pt-6 border-t border-border/40">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
              Back to all articles
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  )
}
