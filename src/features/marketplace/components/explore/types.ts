export type ExploreStory = {
  id: string
  name: string
  cover: string
  seen?: boolean
}

export function storyInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
