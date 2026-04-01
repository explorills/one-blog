import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span className="text-6xl font-bold text-primary/30" style={{ fontFamily: "'Roboto Mono', monospace" }}>404</span>
      <p className="text-muted-foreground mt-4 mb-6">This page doesn't exist.</p>
      <Link
        to="/"
        className="text-sm text-primary hover:underline"
      >
        Back to all articles
      </Link>
    </div>
  )
}
