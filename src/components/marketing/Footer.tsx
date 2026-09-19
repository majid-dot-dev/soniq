import { ArrowUpRight } from 'lucide-react'
import { Container } from './primitives'

const platform = [
  { label: 'Distribution', href: '#release' },
  { label: 'Beat Marketplace', href: '#marketplace' },
  { label: 'Royalties', href: '#royalties' },
  { label: 'Payments', href: '#financial' },
]

const company = [
  { label: 'About', href: '#about' },
  { label: 'Careers', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', href: '#' },
]

const avatars = ['/assets/avatar-1.jpg', '/assets/avatar-2.jpg', '/assets/avatar-3.jpg']

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[15px] font-medium">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-[14.5px] text-white/60 transition-colors hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative z-10 -mt-12 overflow-hidden rounded-t-[2.5rem] bg-ink-dark text-white">
      <Container>
        <div className="grid gap-14 border-b border-white/10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">
          <div className='py-16'>
            <a href="#top" className="text-[28px] font-semibold tracking-[-0.03em]">
              Sound<span className="text-rose-500">Soniq</span>
            </a>
            <a
              href="#get-started"
              aria-label="Get started"
              className="mt-16 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-ink-onlight transition-transform duration-300 hover:scale-[1.04] sm:mt-20 sm:h-28 sm:w-28"
            >
              <ArrowUpRight className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.6} />
            </a>
          </div>

          <div className="flex flex-col justify-between gap-12 lg:border-l lg:border-white/10 lg:pl-16 py-16">
            <h2 className="max-w-xl text-[34px] leading-[1.12] font-medium tracking-[-0.03em] sm:text-[46px]">
              We would love to help you build your music business.
            </h2>
            <div className="flex items-center justify-between gap-6">
              <a
                href="mailto:hello@soniq.com"
                className="text-[15px] text-white/75 transition-colors hover:text-white"
              >
                hello@soniq.com
              </a>
              <div className="flex -space-x-3">
                {avatars.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-11 w-11 rounded-full border-2 border-ink-dark object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 py-12 sm:grid-cols-3 sm:py-14">
          <div className="max-w-xs">
            <p className="text-[15px] font-medium">SoundSoniq</p>
            <p className="mt-3 text-[14px] leading-relaxed text-white/55">
              Music infrastructure for artists, producers, and labels — from the first beat to the first payout.
            </p>
          </div>
          <FooterLinks title="Platform" links={platform} />
          <FooterLinks title="Company" links={company} />
        </div>
      </Container>

      <div className="relative px-4 pt-8 pb-8 sm:px-6">
        <p className="text-center leading-[0.78] font-semibold tracking-[-0.07em] text-[clamp(4.75rem,19.5vw,15.5rem)]">
          SoundSoniq
        </p>
        <span className="absolute top-[42%] left-[6%] rounded-full bg-emerald-300 px-3 py-1 text-[11px] font-medium text-ink-onlight sm:left-[14%] sm:px-3.5 sm:text-[13px]">
          Global release
        </span>
        <span className="absolute top-[4%] left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-ink-onlight sm:px-3.5 sm:text-[13px]">
          Royalty splits
        </span>
        <span className="absolute top-[46%] right-[5%] rounded-full bg-rose-300 px-3 py-1 text-[11px] font-medium text-ink-onlight sm:right-[12%] sm:px-3.5 sm:text-[13px]">
          Beat licenses
        </span>
        <p className="mt-6 text-center text-[12px] text-white/45">
          © {new Date().getFullYear()} SoundSoniq. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
