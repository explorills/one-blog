import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="pt-[72px] pb-16 min-h-screen">
      {children}
    </main>
  )
}
