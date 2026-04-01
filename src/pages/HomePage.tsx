import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { TagBadge } from '@/components/blog/TagBadge'
import { getAllPosts, getAllTags } from '@/lib/blog'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

export default function HomePage() {
  const allPosts = getAllPosts()
  const allTags = getAllTags()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const posts = useMemo(() => {
    if (!activeTag) return allPosts
    return allPosts.filter((p) => p.frontmatter.tags?.includes(activeTag))
  }, [allPosts, activeTag])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="pt-10 sm:pt-14 pb-8 sm:pb-10"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-2"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          ONE Blog
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
        >
          From the ecosystem
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-[13px] sm:text-sm text-muted-foreground mt-2 max-w-lg"
        >
          Updates, insights, and deep dives from the EXPL.ONE ecosystem.
        </motion.p>
      </motion.div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <TagBadge
            tag="All"
            active={!activeTag}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </motion.div>
      )}

      {/* Article grid */}
      {posts.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          key={activeTag ?? 'all'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-12"
        >
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            No articles yet.
          </p>
        </div>
      )}
    </div>
  )
}
