import { useState } from 'react'
import { StoryRing } from './story-ring'
import { StoryViewer } from './story-viewer'
import type { ExploreStory } from './types'

export type { ExploreStory }

const COVERS = [
  'bg-stone-800',
  'bg-rose-950',
  'bg-zinc-800',
  'bg-neutral-800',
  'bg-stone-900',
  'bg-rose-900',
  'bg-zinc-900',
  'bg-neutral-900',
] as const

const STORY_NAMES = [
  'Kelu',
  'Dëwit',
  'Nao',
  'Selasi',
  'Riven',
  'Amara',
  'Koko',
  'Jules',
  'Mira',
  'Tez',
  'Sable',
  'Imani',
  'Nova',
  'Kofi',
  'Zuri',
  'Aden',
  'Layo',
  'Remi',
  'Tari',
  'Yemi',
  'Sade',
  'Obi',
  'Nia',
  'Ezra',
]

const STORIES: ExploreStory[] = STORY_NAMES.map((name, index) => ({
  id: name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-'),
  name,
  cover: COVERS[index % COVERS.length]!,
}))

export function ExploreStories({ stories = STORIES }: { stories?: ExploreStory[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const activeIndex = activeId ? stories.findIndex((story) => story.id === activeId) : -1
  const active = activeIndex >= 0 ? stories[activeIndex] : null

  function open(id: string) {
    setActiveId(id)
    setSeen((prev) => new Set(prev).add(id))
  }

  function close() {
    setActiveId(null)
  }

  function next() {
    if (activeIndex < 0) return
    const following = stories[activeIndex + 1]
    if (following) open(following.id)
    else close()
  }

  function prev() {
    if (activeIndex <= 0) {
      close()
      return
    }
    open(stories[activeIndex - 1]!.id)
  }

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:-mx-6 lg:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-3.5 pb-1">
          {stories.map((story) => (
            <StoryRing
              key={story.id}
              story={{ ...story, seen: seen.has(story.id) || story.seen }}
              active={activeId === story.id}
              onSelect={() => open(story.id)}
            />
          ))}
        </div>
      </div>

      <StoryViewer
        story={active}
        open={active != null}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    </>
  )
}
