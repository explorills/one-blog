import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span
        className="text-7xl font-bold text-primary/20"
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        404
      </span>
      <p className="text-muted-foreground mt-4 mb-6 text-sm">
        This page doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:text-primary/80 transition-colors"
        style={{ fontFamily: "'Roboto Mono', monospace" }}
      >
        <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
        Back to all articles
      </Link>
    </div>
  )
}
