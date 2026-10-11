import { motion, useReducedMotion } from 'motion/react'
// import { ChevronRight } from 'lucide-react'
import { MarketingButton, Waveform } from './primitives'
import { EASE } from './motion'

function HeroWaves() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      aria-hidden
      className="h-10 w-[min(22rem,72vw)]"
    >
      <Waveform bars={48} className="h-full text-rose-500" animated={!reduceMotion} />
    </motion.div>
  )
}

export function Hero() {
  return (
    <section id="top" className="bg-white relative overflow-hidden pt-37.5 pb-28 sm:pt-42 sm:pb-36">
      {/* atmospheric backdrop */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/assets/hero-background.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] opacity-60 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_28%,_rgba(10,9,7,0.94),_rgba(10,9,7,0.62)_55%,_rgba(10,9,7,0.55)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-dark" />
        <FloatingOrb
          duration={16}
          travel={44}
          className="left-1/2 top-[-260px] h-[680px] w-[980px] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(226,85,31,0.38),_transparent_65%)]"
        />
        <FloatingOrb
          duration={20}
          delay={1}
          travel={32}
          className="right-[-180px] top-[40px] h-[460px] w-[460px] bg-[radial-gradient(circle,_rgba(123,114,232,0.26),_transparent_70%)]"
        />
        <FloatingOrb
          duration={18}
          delay={2}
          travel={28}
          className="left-[-180px] top-[260px] h-[420px] w-[420px] bg-[radial-gradient(circle,_rgba(47,203,125,0.2),_transparent_70%)]"
        />
      </div> */}

      <div className="flex flex-col items-center text-center">
        <HeroWaves />

        <motion.h1
          initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-7 max-w-4xl text-balance text-[42px] font-medium leading-[1.06] tracking-[-0.025em] text-black sm:text-[58px] lg:text-[68px]"
        >
          Everything you need to build{' '}
          <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400 bg-clip-text text-transparent">
            your music business.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-black/75 sm:text-[18px]"
        >
          Create, release, sell, and earn from your music — all from one platform built for
          artists, producers, and labels.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <MarketingButton variant="primary" size="lg" href="/signup" magnetic>
            <span aria-hidden className="grid h-4 w-4 place-items-center rounded-full bg-white text-rose-500">
              <svg viewBox="0 0 10 10" className="h-3 w-3 translate-x-px">
                <path d="M2.6 1.15v7.7L8.7 5z" fill="currentColor" />
              </svg>
            </span>
            Get started
          </MarketingButton>
          {/* <MarketingButton variant="secondary" size="lg" href="#platform">
            Contact sales
            <ChevronRight className="h-4 w-4" />
          </MarketingButton> */}
        </motion.div>
      </div>

     
    </section>
  )
}