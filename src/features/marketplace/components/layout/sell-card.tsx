import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-provider'
import { dashboardHref } from '@/lib/host'

export function SellCard({ collapsed }: { collapsed?: boolean }) {
  const { status, accessToken } = useAuth()
  const href = status === 'authenticated' ? dashboardHref(accessToken) : '/signup'

  if (collapsed) {
    const className =
      'mx-auto mb-3 grid size-10 place-items-center rounded-xl bg-[radial-gradient(130%_120%_at_0%_0%,#fb7185_0%,#e11d48_34%,#9f1239_62%,#3f0a16_84%,#14060a_100%)] text-[13px] font-bold text-white transition-transform hover:scale-105'
    return status === 'authenticated' ? (
      <a href={href} aria-label="Open studio" title="Sell on Soniq" className={className}>
        S
      </a>
    ) : (
      <Link to="/signup" aria-label="Get started selling" title="Sell on Soniq" className={className}>
        S
      </Link>
    )
  }

  return (
    <div className="mx-3 mb-4 rounded-[1.35rem] bg-[radial-gradient(130%_120%_at_0%_0%,#fb7185_0%,#e11d48_34%,#9f1239_62%,#3f0a16_84%,#14060a_100%)] px-4 pt-4 pb-3.5">
      <p className="text-[15px] font-bold tracking-[-0.02em] text-white">Sell on Soniq</p>
      <p className="mt-1.5 text-[12.5px] leading-snug font-medium text-white/90">
        Upload beats, set licenses, and get paid.
      </p>
      {status === 'authenticated' ? (
        <a
          href={href}
          className="mt-4 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-rose-600"
        >
          Open studio
        </a>
      ) : (
        <Link
          to="/signup"
          className="mt-4 inline-flex rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-rose-600"
        >
          Get started
        </Link>
      )}
    </div>
  )
}
