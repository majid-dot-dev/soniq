import ChartTrackRow, {
  type ChartTrack,
} from '@/features/marketplace/components/charts/chart-track-row'

const COVERS = [
  'bg-rose-950',
  'bg-stone-900',
  'bg-zinc-800',
  'bg-neutral-900',
  'bg-stone-800',
  'bg-rose-900',
  'bg-zinc-900',
  'bg-neutral-800',
] as const

const CHART: ChartTrack[] = [
  {
    id: 'night-market',
    title: 'Night Market',
    producer: 'Jules',
    genre: 'Amapiano',
    bpm: 114,
    priceLabel: '$35',
    cover: COVERS[0],
    plays: 184_200,
    delta: 2,
  },
  {
    id: 'glass-city',
    title: 'Glass City',
    producer: 'Dëwit',
    genre: 'Afrobeats',
    bpm: 102,
    priceLabel: '$40',
    cover: COVERS[3],
    plays: 162_800,
    delta: 0,
  },
  {
    id: 'iron-choir',
    title: 'Iron Choir',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 150,
    priceLabel: '$30',
    cover: COVERS[5],
    plays: 149_400,
    delta: -1,
  },
  {
    id: 'half-light',
    title: 'Half Light',
    producer: 'Kelu',
    genre: 'Amapiano',
    bpm: 113,
    priceLabel: '$30',
    cover: COVERS[4],
    plays: 138_100,
    delta: 4,
  },
  {
    id: 'after-service',
    title: 'After Service',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 87,
    priceLabel: '$45',
    cover: COVERS[1],
    plays: 121_600,
    delta: 1,
  },
  {
    id: 'blue-hour',
    title: 'Blue Hour',
    producer: 'Jules',
    genre: 'Alté',
    bpm: 90,
    priceLabel: '$40',
    cover: COVERS[1],
    plays: 118_900,
    delta: -2,
  },
  {
    id: 'harmattan',
    title: 'Harmattan',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 96,
    priceLabel: '$35',
    cover: COVERS[4],
    plays: 109_300,
    delta: null,
  },
  {
    id: 'quiet-riot',
    title: 'Quiet Riot',
    producer: 'Nao',
    genre: 'Drill',
    bpm: 144,
    priceLabel: '$25',
    cover: COVERS[2],
    plays: 97_800,
    delta: 3,
  },
  {
    id: 'static-bloom',
    title: 'Static Bloom',
    producer: 'Kelu',
    genre: 'Gqom',
    bpm: 132,
    priceLabel: '$20',
    cover: COVERS[2],
    plays: 91_200,
    delta: -3,
  },
  {
    id: 'palm-wine',
    title: 'Palm Wine',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 105,
    priceLabel: '$30',
    cover: COVERS[0],
    plays: 86_500,
    delta: 0,
  },
  {
    id: 'concrete-garden',
    title: 'Concrete Garden',
    producer: 'Riven',
    genre: 'Gqom',
    bpm: 128,
    priceLabel: '$85',
    cover: COVERS[7],
    plays: 79_400,
    delta: 5,
  },
  {
    id: 'soft-landing',
    title: 'Soft Landing',
    producer: 'Amara',
    genre: 'R&B',
    bpm: 78,
    priceLabel: '$50',
    cover: COVERS[1],
    plays: 74_100,
    delta: -1,
  },
  {
    id: 'red-dust',
    title: 'Red Dust',
    producer: 'Selasi',
    genre: 'Afro-fusion',
    bpm: 98,
    priceLabel: '$25',
    cover: COVERS[6],
    plays: 68_900,
    delta: 2,
  },
  {
    id: 'sunday-drive',
    title: 'Sunday Drive',
    producer: 'Koko',
    genre: 'Afrobeats',
    bpm: 100,
    priceLabel: '$30',
    cover: COVERS[1],
    plays: 63_200,
    delta: null,
  },
  {
    id: 'low-light',
    title: 'Low Light',
    producer: 'Riven',
    genre: 'Alté',
    bpm: 108,
    priceLabel: '$30',
    cover: COVERS[3],
    plays: 58_700,
    delta: -4,
  },
]

export default function TopChartsPage() {
  return (
    <section className="h-full overflow-auto px-4 py-6 lg:px-6 lg:py-4">
      <header>
        <h1 className="text-[24px] font-medium tracking-[-0.03em] text-white sm:text-[26px] lg:text-[32px]">
          Top charts
        </h1>
      </header>

      <ol className="mt-8 divide-y divide-white/[0.06]">
        {CHART.map((track, index) => (
          <li key={track.id}>
            <ChartTrackRow track={track} rank={index + 1} />
          </li>
        ))}
      </ol>
    </section>
  )
}
