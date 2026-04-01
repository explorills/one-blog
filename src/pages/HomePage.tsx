import { motion } from 'framer-motion'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { getAllPosts } from '@/lib/blog'

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
  const posts = getAllPosts()

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
          Articles, insights, and perspectives from the EXPL.ONE community.
        </motion.p>
      </motion.div>

      {/* Article grid */}
      {posts.length > 0 ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
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
