interface TagBadgeProps {
  tag: string
  active?: boolean
  onClick?: () => void
}

export function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all duration-200'
  const style = active
    ? 'bg-primary/15 text-primary border border-primary/30'
    : 'bg-muted/60 text-muted-foreground border border-border/40 hover:border-primary/25 hover:text-foreground'

  if (onClick) {
    return (
      <button className={`${base} ${style}`} onClick={onClick} style={{ fontFamily: "'Roboto Mono', monospace" }}>
        {tag}
      </button>
    )
  }

  return (
    <span className={`${base} ${style}`} style={{ fontFamily: "'Roboto Mono', monospace" }}>
      {tag}
    </span>
  )
}
