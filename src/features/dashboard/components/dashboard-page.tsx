import type { ReactNode } from 'react'

export function DashboardPage({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <section className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
      <h1 className="text-[32px] font-medium tracking-[-0.03em] text-white">{title}</h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-mute">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  )
}
