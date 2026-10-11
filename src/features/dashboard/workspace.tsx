import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/features/auth/auth-provider'
import type { Profile, ProfileType } from '@/features/auth/types'

export type WorkspaceType = 'Artist' | 'Producer' | 'Label'

export type Workspace = {
  id: string
  name: string
  username: string
  type: WorkspaceType
  profile: Profile
}

const TYPE_LABEL: Record<ProfileType, WorkspaceType> = {
  artist: 'Artist',
  producer: 'Producer',
  label: 'Label',
}

function toWorkspace(profile: Profile): Workspace {
  return {
    id: profile.id,
    name: profile.displayName,
    username: profile.username,
    type: TYPE_LABEL[profile.type],
    profile,
  }
}

type WorkspaceContextValue = {
  current: Workspace
  workspaces: Workspace[]
  setCurrentId: (id: string) => void
  ready: boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { status, profiles, activeProfile, activateProfile } = useAuth()
  const workspaces = useMemo(() => profiles.map(toWorkspace), [profiles])
  const [currentId, setCurrentIdState] = useState<string | null>(null)

  useEffect(() => {
    if (activeProfile?.id) {
      setCurrentIdState(activeProfile.id)
      return
    }
    if (workspaces[0]) {
      setCurrentIdState(workspaces[0].id)
    }
  }, [activeProfile?.id, workspaces])

  const setCurrentId = useCallback(
    (id: string) => {
      setCurrentIdState(id)
      void activateProfile(id).catch(() => {
        // Keep local selection even if persistence fails briefly.
      })
    },
    [activateProfile],
  )

  const current =
    workspaces.find((workspace) => workspace.id === currentId) ?? workspaces[0] ?? null

  const value = useMemo<WorkspaceContextValue | null>(() => {
    if (!current) return null
    return {
      current,
      workspaces,
      setCurrentId,
      ready: status === 'authenticated' && workspaces.length > 0,
    }
  }, [current, workspaces, setCurrentId, status])

  if (!value) {
    return (
      <div className="grid min-h-svh place-items-center bg-[#0c0c0e] text-[14px] text-ink-mute">
        Setting up your profile…
      </div>
    )
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return value
}
