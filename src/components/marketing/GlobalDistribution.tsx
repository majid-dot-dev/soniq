import { Clapperboard, Download, Share2, Users, Waves } from 'lucide-react'
import { Container, Reveal, SectionHeading } from './primitives'
import { FloatingOrb } from './motion'
import { cn } from '@/lib/utils'

const categories = [
  { label: 'Streaming', icon: Waves, tone: 'signal' as const },
  { label: 'Social', icon: Share2, tone: 'ember' as const },
  { label: 'Video', icon: Clapperboard, tone: 'yield' as const },
  { label: 'Download', icon: Download, tone: 'signal' as const },
  { label: 'UGC', icon: Users, tone: 'ember' as const },
]

const nodeTone: Record<string, string> = {
  ember: 'border-ember/30 bg-ember-tint text-ember-bright',
  signal: 'border-signal/30 bg-signal-tint text-signal',
  yield: 'border-yield/30 bg-yield-tint text-yield-bright',
}
const dotTone: Record<string, string> = {
  ember: '#f2703b',
  signal: '#7b72e8',
  yield: '#2fcb7d',
}

// All coordinates live in a 0-100 percentage space so the diagram scales
// fluidly with its container instead of relying on fixed pixel math.
const CENTER = 50
const RADIUS = 36

function RadialDiagram() {
  const nodePositions = categories.map((c, i) => {
    const angle = (-90 + i * (360 / categories.length)) * (Math.PI / 180)
    const x = CENTER + RADIUS * Math.cos(angle)
    const y = CENTER + RADIUS * Math.sin(angle)
    return { ...c, x, y }
  })

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      {/* scattered dot texture, suggests global reach without a literal map */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="fadeMask" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="dotMask">
            <rect width="100" height="100" fill="url(#fadeMask)" />
          </mask>
        </defs>
        <g mask="url(#dotMask)">
          {Array.from({ length: 14 }).map((_, row) =>
            Array.from({ length: 14 }).map((__, col) => {
              const seed = (row * 14 + col) * 9301
              const jitter = ((seed % 100) / 100) * 0.5
              if ((row + col) % 3 === 0) return null
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={(col + 0.5 + jitter) * (100 / 14)}
                  cy={(row + 0.5) * (100 / 14)}
                  r="0.5"
                  fill="#ffffff"
                  opacity={0.16}
                />
              )
            }),
          )}
        </g>

        <g style={{ transformOrigin: '50px 50px' }} className="animate-spin-slow">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.3" strokeDasharray="0.6 1.6" />
        </g>

        {nodePositions.map((n) => (
          <g key={n.label}>
            <line x1={CENTER} y1={CENTER} x2={n.x} y2={n.y} stroke="rgba(255,255,255,0.14)" strokeWidth="0.35" />
            <circle r="0.9" fill={dotTone[n.tone]}>
              <animateMotion dur="3.6s" repeatCount="indefinite" path={`M${CENTER},${CENTER} L${n.x},${n.y}`} />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="3.6s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      <div
        className="absolute flex w-[124px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl bg-ink-dark px-4 py-3.5 text-center shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]"
        style={{ left: `${CENTER}%`, top: `${CENTER}%` }}
      >
        <span className="text-[12.5px] font-medium text-white">Your release</span>
        <span className="text-[10.5px] text-white/50">Delivered from Soniq</span>
      </div>

      {nodePositions.map((n) => (
        <div
          key={n.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_1px_2px_rgba(0,0,0,0.3)] sm:h-12 sm:w-12', nodeTone[n.tone])}>
            <n.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
          </div>
          <span className="whitespace-nowrap text-[10.5px] font-medium text-ink-2 sm:text-[11.5px]">{n.label}</span>
        </div>
      ))}
    </div>
  )
}

export function GlobalDistribution() {
  return (
    <section className="relative overflow-hidden border-t border-line-dark py-24 sm:py-32">
      <FloatingOrb duration={22} travel={30} className="left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(123,114,232,0.1),_transparent_70%)]" />
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Global distribution"
          eyebrowTone="signal"
          title="From your studio to listeners everywhere."
          description="One release, delivered across the platforms where music actually gets heard — streaming, social, video, download, and user-generated content."
          className="mx-auto items-center"
        />
      </Container>

      <Reveal delay={80} className="relative mt-16 px-6">
        <RadialDiagram />
      </Reveal>
    </section>
  )
}
