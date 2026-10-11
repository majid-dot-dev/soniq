import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarBlank,
  DotsThreeVertical,
  File,
  Flag,
  MagnifyingGlass,
  MapPin,
  Microphone,
  Paperclip,
  PaperPlaneTilt,
  Prohibit,
  Smiley,
  Stop,
  User,
  Waveform,
  X,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { threadsFor, type ChatMessage, type ChatPresence, type ChatThread } from '@/features/dashboard/chats'
import { useWorkspace, type WorkspaceType } from '@/features/dashboard/workspace'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

const EMOJIS = [
  '😀', '😂', '🥲', '😍', '🤩', '😎', '🔥', '💯',
  '✨', '🎵', '🎶', '🎤', '🎧', '💜', '❤️', '👏',
  '🙌', '🙏', '✅', '👀', '💭', '🚀', '💰', '📀',
]

type PendingFile = { id: string; name: string; sizeLabel: string }

export default function ChatsPage() {
  const { current } = useWorkspace()
  return <ChatsInbox key={current.type} workspaceType={current.type} />
}

function ChatsInbox({ workspaceType }: { workspaceType: WorkspaceType }) {
  const reduce = useReducedMotion()
  const [catalog, setCatalog] = useState(() => threadsFor(workspaceType))
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? '')
  const [mobilePane, setMobilePane] = useState<'list' | 'thread'>('list')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordSecs, setRecordSecs] = useState(0)
  const [threadSearchOpen, setThreadSearchOpen] = useState(false)
  const [threadQuery, setThreadQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const threadSearchRef = useRef<HTMLInputElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recordTimerRef = useRef<number | null>(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return catalog.filter((thread) => {
      if (!needle) return true
      return [thread.name, thread.preview, thread.role]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle))
    })
  }, [catalog, query])

  const selected = catalog.find((thread) => thread.id === selectedId) ?? catalog[0]

  const threadMessages = useMemo(() => {
    if (!selected) return []
    const needle = threadQuery.trim().toLowerCase()
    if (!needle) return selected.messages
    return selected.messages.filter((message) => message.body.toLowerCase().includes(needle))
  }, [selected, threadQuery])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' })
  }, [selected?.id, selected?.messages.length, reduce])

  useEffect(() => {
    if (threadSearchOpen) threadSearchRef.current?.focus()
  }, [threadSearchOpen])

  useEffect(() => {
    if (!recording) return
    recordTimerRef.current = window.setInterval(() => {
      setRecordSecs((secs) => secs + 1)
    }, 1000)
    return () => {
      if (recordTimerRef.current !== null) {
        window.clearInterval(recordTimerRef.current)
        recordTimerRef.current = null
      }
    }
  }, [recording])

  function closeThreadSearch() {
    setThreadSearchOpen(false)
    setThreadQuery('')
  }

  function openThread(id: string) {
    setSelectedId(id)
    setMobilePane('thread')
    closeThreadSearch()
    setProfileOpen(false)
    setRecording(false)
    setPendingFiles([])
    setDraft('')
    setCatalog((threads) =>
      threads.map((thread) => (thread.id === id ? { ...thread, unread: 0 } : thread)),
    )
  }

  function pushMessages(messages: ChatMessage[], preview: string) {
    if (!selected) return
    setCatalog((threads) =>
      threads.map((thread) =>
        thread.id === selected.id
          ? {
              ...thread,
              preview,
              time: 'Just now',
              unread: 0,
              messages: [...thread.messages, ...messages],
            }
          : thread,
      ),
    )
  }

  function send() {
    if (!selected) return
    const body = draft.trim()
    const stamp = Date.now()
    const next: ChatMessage[] = []

    if (body) {
      next.push({
        id: `local-${stamp}`,
        from: 'me',
        body,
        sentAt: 'Just now',
        kind: 'text',
      })
    }

    pendingFiles.forEach((file, index) => {
      next.push({
        id: `local-file-${stamp}-${index}`,
        from: 'me',
        body: file.name,
        sentAt: 'Just now',
        kind: 'file',
        fileName: file.name,
      })
    })

    if (next.length === 0) return

    const preview =
      pendingFiles.length && !body
        ? `Sent ${pendingFiles.length === 1 ? pendingFiles[0].name : `${pendingFiles.length} files`}`
        : body

    pushMessages(next, preview)
    setDraft('')
    setPendingFiles([])
    setEmojiOpen(false)
  }

  function insertEmoji(emoji: string) {
    setDraft((value) => `${value}${emoji}`)
    setEmojiOpen(false)
    requestAnimationFrame(() => composerRef.current?.focus())
  }

  function onPickFiles(files: FileList | null) {
    if (!files?.length) return
    const next = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      sizeLabel: formatFileSize(file.size),
    }))
    setPendingFiles((current) => [...current, ...next].slice(0, 5))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function cancelRecording() {
    setRecording(false)
    setRecordSecs(0)
  }

  function startRecording() {
    setEmojiOpen(false)
    setRecordSecs(0)
    setRecording(true)
  }

  function sendVoiceNote() {
    if (!selected || recordSecs < 1) {
      cancelRecording()
      return
    }
    const duration = recordSecs
    pushMessages(
      [
        {
          id: `local-voice-${Date.now()}`,
          from: 'me',
          body: `Voice note · ${formatDuration(duration)}`,
          sentAt: 'Just now',
          kind: 'voice',
          durationSec: duration,
        },
      ],
      `Voice note · ${formatDuration(duration)}`,
    )
    cancelRecording()
  }

  const canSend = Boolean(draft.trim() || pendingFiles.length)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* <div className="shrink-0 px-5 pt-6 sm:px-6 lg:px-6 lg:pt-5">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[48px]">Chats</h1>
          <p className="mt-2 text-[14px] text-ink-mute">
            {description[current.type]}
            {unreadTotal > 0 ? ` · ${unreadTotal} unread` : ''}
          </p>
        </motion.div>
      </div> */}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-full min-w-0 flex-col border-white/10 md:w-88 md:shrink-0 md:border-r lg:w-96">
          <div className="shrink-0 border-b border-white/10 px-3 py-3">
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-white">Chats</h1>
            <label className="mt-3 flex w-full items-center gap-2 rounded-xl bg-white/8 px-3 py-2">
              <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chats"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
              />
            </label>
          </div>

          <div className={cn('min-h-0 flex-1 overflow-auto', mobilePane === 'thread' && 'hidden md:block')}>
            {visible.length === 0 ? (
              <p className="px-4 py-10 text-center text-[13px] text-ink-mute">No chats match.</p>
            ) : (
              <ul className="flex flex-col px-2.5 py-3">
                {visible.map((thread) => (
                  <li key={thread.id}>
                    <ThreadRow
                      thread={thread}
                      active={selected?.id === thread.id}
                      onSelect={() => openThread(thread.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section
          className={cn(
            'min-w-0 flex-1 bg-[#121214]',
            mobilePane === 'thread' ? 'flex' : 'hidden md:flex',
          )}
        >
          {selected ? (
            <>
              <div className="flex min-w-0 flex-1 flex-col">
              <header className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobilePane('list')}
                    className="shrink-0 text-[13px] text-ink-mute md:hidden"
                  >
                    Back
                  </button>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar thread={selected} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-white">{selected.name}</p>
                      <p className="truncate text-[12px] text-ink-mute">Last seen 12 hours ago</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <motion.div
                      initial={false}
                      animate={{ width: threadSearchOpen ? 280 : 36 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={cn(
                        'flex h-9 items-center overflow-hidden rounded-full',
                        threadSearchOpen && 'bg-white/8 px-3',
                      )}
                    >
                      {threadSearchOpen ? (
                        <motion.label
                          key="thread-search-field"
                          initial={reduce ? false : { opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="flex w-full min-w-0 items-center gap-2"
                        >
                          <MagnifyingGlass size={14} className="shrink-0 text-ink-mute" />
                          <input
                            ref={threadSearchRef}
                            type="search"
                            value={threadQuery}
                            onChange={(event) => setThreadQuery(event.target.value)}
                            placeholder="Search"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-ink-mute"
                          />
                          <button
                            type="button"
                            aria-label="Close search"
                            onClick={closeThreadSearch}
                            className="shrink-0 text-ink-mute transition-colors hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </motion.label>
                      ) : (
                        <button
                          type="button"
                          aria-label="Search conversation"
                          onClick={() => setThreadSearchOpen(true)}
                          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
                        >
                          <MagnifyingGlass size={18} />
                        </button>
                      )}
                    </motion.div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label="Chat options"
                        className="grid size-9 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <DotsThreeVertical size={18} weight="bold" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="min-w-44 rounded-xl bg-[rgba(16,16,18,0.96)] p-1.5 text-ink ring-white/15 backdrop-blur-2xl"
                      >
                        <DropdownMenuItem
                          onClick={() => setProfileOpen(true)}
                          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white"
                        >
                          <User size={15} />
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-2 focus:bg-white/8 focus:text-white">
                          <Flag size={15} />
                          Report chat
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium focus:bg-rose-500/15 focus:text-rose-400"
                        >
                          <Prohibit size={15} />
                          Block user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-5">
                <div className="flex w-full flex-col gap-3">
                  {threadMessages.length === 0 ? (
                    <p className="py-10 text-center text-[13px] text-ink-mute">
                      {threadQuery.trim() ? 'No messages match.' : 'No messages yet.'}
                    </p>
                  ) : (
                    threadMessages.map((message) => {
                      const mine = message.from === 'me'
                      return (
                        <div key={message.id} className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
                          <MessageBubble message={message} mine={mine} />
                          <span className="px-1 text-[11px] text-ink-faint">{message.sentAt}</span>
                        </div>
                      )
                    })
                  )}
                  <div ref={endRef} />
                </div>
              </div>

              <footer className="shrink-0 border-t border-white/10 px-4 py-3 sm:px-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => onPickFiles(event.target.files)}
                />

                <AnimatePresence initial={false}>
                  {pendingFiles.length > 0 && !recording ? (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduce ? undefined : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="mb-2 overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2">
                        {pendingFiles.map((file) => (
                          <span
                            key={file.id}
                            className="inline-flex max-w-full items-center gap-2 rounded-xl bg-white/8 px-2.5 py-1.5 text-[12px] text-ink-2 ring-1 ring-white/10"
                          >
                            <File size={14} className="shrink-0 text-rose-400" />
                            <span className="min-w-0 truncate font-medium text-white">{file.name}</span>
                            <span className="shrink-0 text-ink-faint">{file.sizeLabel}</span>
                            <button
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => setPendingFiles((files) => files.filter((item) => item.id !== file.id))}
                              className="text-ink-mute transition-colors hover:text-white"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {recording ? (
                  <div className="flex w-full items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-white/8 text-ink-mute transition-colors hover:bg-white/12 hover:text-white"
                      aria-label="Cancel recording"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white/8 px-3.5 py-2.5">
                      <span className="relative flex size-2.5 shrink-0">
                        <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/60" />
                        <span className="relative size-2.5 rounded-full bg-rose-500" />
                      </span>
                      <span className="shrink-0 text-[13px] font-medium text-white tnum">{formatDuration(recordSecs)}</span>
                      <div className="flex min-w-0 flex-1 items-end gap-0.5">
                        {Array.from({ length: 28 }).map((_, index) => (
                          <span
                            key={index}
                            className="w-1 rounded-full bg-rose-400/70"
                            style={{
                              height: `${6 + ((index * 7) % 14)}px`,
                              opacity: 0.45 + ((index * 3) % 5) * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <Waveform size={16} className="shrink-0 text-ink-mute" />
                    </div>
                    <button
                      type="button"
                      onClick={sendVoiceNote}
                      disabled={recordSecs < 1}
                      aria-label="Send voice note"
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Stop size={16} weight="fill" />
                    </button>
                  </div>
                ) : (
                  <form
                    className="flex w-full items-end gap-2"
                    onSubmit={(event) => {
                      event.preventDefault()
                      send()
                    }}
                  >
                    <div className="flex min-w-0 flex-1 items-end gap-1 rounded-2xl bg-white/8 px-2 py-1.5">
                      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                        <PopoverTrigger
                          type="button"
                          aria-label="Add emoji"
                          className={cn(
                            'grid size-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white',
                            emojiOpen && 'bg-white/8 text-white',
                          )}
                        >
                          <Smiley size={18} />
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="start"
                          sideOffset={10}
                          className="w-72 rounded-2xl bg-[rgba(16,16,18,0.98)] p-2.5 text-white ring-white/15 backdrop-blur-2xl"
                        >
                          <p className="mb-2 px-1 text-[11px] font-medium text-ink-mute">Emoji</p>
                          <div className="grid grid-cols-8 gap-1">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => insertEmoji(emoji)}
                                className="grid size-8 place-items-center rounded-lg text-[18px] transition-colors hover:bg-white/10"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      <button
                        type="button"
                        aria-label="Attach file"
                        onClick={() => fileInputRef.current?.click()}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <Paperclip size={17} />
                      </button>

                      <textarea
                        ref={composerRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            send()
                          }
                        }}
                        rows={1}
                        placeholder="Write a message"
                        className="max-h-28 min-h-8 w-full resize-none bg-transparent py-1.5 text-[14px] leading-relaxed text-white outline-none placeholder:text-ink-mute"
                      />
                    </div>

                    {canSend ? (
                      <button
                        type="submit"
                        aria-label="Send"
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-white"
                      >
                        <PaperPlaneTilt size={16} weight="fill" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Record voice note"
                        onClick={startRecording}
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-white/8 text-ink-mute transition-colors hover:bg-white/12 hover:text-white"
                      >
                        <Microphone size={18} />
                      </button>
                    )}
                  </form>
                )}
              </footer>
              </div>

              <AnimatePresence initial={false}>
                {profileOpen && selected ? (
                  <ProfilePanel
                    key="chat-profile"
                    thread={selected}
                    reduce={!!reduce}
                    onClose={() => setProfileOpen(false)}
                  />
                ) : null}
              </AnimatePresence>
            </>
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <p className="text-[14px] text-ink-mute">Select a conversation.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MessageBubble({ message, mine }: { message: ChatMessage; mine: boolean }) {
  if (message.kind === 'voice') {
    return (
      <div
        className={cn(
          'flex max-w-[85%] items-center gap-3 rounded-2xl px-3.5 py-2.5',
          mine ? 'bg-rose-500 text-white' : 'bg-white/8 text-ink-2',
        )}
      >
        <span
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full',
            mine ? 'bg-white/20' : 'bg-white/10',
          )}
        >
          <Microphone size={14} weight="fill" />
        </span>
        <div className="flex min-w-0 flex-1 items-end gap-0.5">
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className={cn('w-1 rounded-full', mine ? 'bg-white/70' : 'bg-white/35')}
              style={{ height: `${6 + ((index * 5) % 12)}px` }}
            />
          ))}
        </div>
        <span className={cn('shrink-0 text-[12px] tnum', mine ? 'text-white/85' : 'text-ink-mute')}>
          {formatDuration(message.durationSec ?? 0)}
        </span>
      </div>
    )
  }

  if (message.kind === 'file') {
    return (
      <div
        className={cn(
          'flex max-w-[85%] items-center gap-3 rounded-2xl px-3.5 py-2.5',
          mine ? 'bg-rose-500 text-white' : 'bg-white/8 text-ink-2',
        )}
      >
        <span
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-xl',
            mine ? 'bg-white/20' : 'bg-white/10',
          )}
        >
          <File size={16} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{message.fileName ?? message.body}</p>
          <p className={cn('mt-0.5 text-[11px]', mine ? 'text-white/75' : 'text-ink-mute')}>Attachment</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed',
        mine ? 'bg-rose-500 text-white' : 'bg-white/8 text-ink-2',
      )}
    >
      {message.body}
    </div>
  )
}

function ThreadRow({
  thread,
  active,
  onSelect,
}: {
  thread: ChatThread
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors',
        active ? 'bg-white/10' : 'hover:bg-white/5',
      )}
    >
      <Avatar thread={thread} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn('min-w-0 flex-1 truncate text-[14px] font-medium', thread.unread ? 'text-white' : 'text-ink-2')}>
            {thread.name}
          </span>
          <span className="shrink-0 text-[11px] text-ink-faint">{thread.time}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          <span className={cn('min-w-0 flex-1 truncate text-[12px]', thread.unread ? 'text-ink-2' : 'text-ink-mute')}>
            {thread.preview}
          </span>
          {thread.unread > 0 ? (
            <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white tnum">
              {thread.unread}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  )
}

function ProfilePanel({
  thread,
  reduce,
  onClose,
}: {
  thread: ChatThread
  reduce: boolean
  onClose: () => void
}) {
  const fade = (delay: number) =>
    reduce
      ? undefined
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: EASE },
        }

  return (
    <motion.aside
      initial={reduce ? false : { width: 0, opacity: 0 }}
      animate={{ width: 360, opacity: 1 }}
      exit={reduce ? undefined : { width: 0, opacity: 0 }}
      transition={{ duration: 0.38, ease: EASE }}
      className="hidden h-full shrink-0 overflow-hidden border-l border-white/10 xl:flex"
    >
      <div className="flex h-full w-90 flex-col overflow-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={thread.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-full flex-col"
          >
            <div className="relative shrink-0">
              <div className="relative h-44 overflow-hidden">
                {thread.avatar ? (
                  <motion.img
                    key={`${thread.id}-cover`}
                    src={thread.avatar}
                    alt=""
                    initial={reduce ? false : { scale: 1.08, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="size-full object-cover blur-[2px] brightness-75"
                  />
                ) : (
                  <div className="size-full bg-linear-to-br from-rose-500/40 via-white/10 to-transparent" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-[#121214]" />
                <button
                  type="button"
                  aria-label="Close profile"
                  onClick={onClose}
                  className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>

              <motion.div
                key={`${thread.id}-avatar`}
                initial={reduce ? false : { opacity: 0, scale: 0.86, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
                className="absolute bottom-0 left-5 translate-y-1/2"
              >
                <span className="relative block size-22">
                  {thread.avatar ? (
                    <img
                      src={thread.avatar}
                      alt=""
                      className="size-full rounded-full object-cover ring-4 ring-[#121214]"
                    />
                  ) : (
                    <span className="grid size-full place-items-center rounded-full bg-white/10 text-[22px] font-semibold tracking-wide text-white ring-4 ring-[#121214]">
                      {thread.initials}
                    </span>
                  )}
                  <span
                    className={cn(
                      'absolute right-1 bottom-1 size-3.5 rounded-full ring-[3px] ring-[#121214]',
                      presenceClass(thread.presence),
                      thread.presence === 'online' && 'shadow-[0_0_0_4px_rgba(47,203,125,0.18)]',
                    )}
                    aria-label={thread.presence}
                  />
                </span>
              </motion.div>
            </div>

            <div className="flex flex-1 flex-col bg-[#121214] px-5 pt-14 pb-6">
              <motion.div {...fade(0.12)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[22px] font-semibold tracking-[-0.03em] text-white">{thread.name}</p>
                    <p className="mt-0.5 truncate text-[13px] text-ink-mute">{thread.handle}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-ink-2">
                    {thread.role}
                  </span>
                </div>
                <p className="mt-2.5 flex items-center gap-2 text-[13px] text-ink-2">
                  <span className={cn('size-2 rounded-full', presenceClass(thread.presence))} aria-hidden />
                  {presenceLabel(thread.presence)}
                  {thread.presence === 'online' ? (
                    <span className="text-ink-faint">· Active now</span>
                  ) : null}
                </p>
              </motion.div>

              <motion.div {...fade(0.18)} className="mt-4 flex flex-col gap-2 text-[13px] text-ink-mute">
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" />
                  {thread.location}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarBlank size={14} className="shrink-0" />
                  Joined {thread.joined}
                </p>
              </motion.div>

              <motion.div {...fade(0.24)} className="mt-6">
                <p className="text-[12px] font-medium text-ink-mute">Bio</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{thread.bio}</p>
              </motion.div>

              {/* {thread.context ? (
                <motion.div {...fade(0.3)} className="mt-5">
                  <p className="text-[12px] font-medium text-ink-mute">Talking about</p>
                  <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-white/6 px-3 py-2.5 ring-1 ring-white/8">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-500/15 text-rose-400">
                      <MusicNotes size={15} weight="fill" />
                    </span>
                    <span className="min-w-0 truncate text-[13px] font-medium text-white">{thread.context}</span>
                  </div>
                </motion.div>
              ) : null} */}

              {/* <motion.div {...fade(0.34)} className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Messages', value: String(thread.messages.length), icon: ChatCircle },
                  { label: 'Purchases', value: String(thread.purchases), icon: ShoppingBag },
                  { label: 'Since', value: thread.joined.split(' ')[1] ?? thread.joined, icon: CalendarBlank },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/5 px-2.5 py-3 text-center">
                    <stat.icon size={14} className="mx-auto text-ink-mute" />
                    <p className="mt-2 text-[18px] font-medium tracking-[-0.03em] text-white tnum">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] text-ink-mute">{stat.label}</p>
                  </div>
                ))}
              </motion.div> */}

              {/* <motion.div {...fade(0.4)} className="mt-auto flex flex-col gap-2 pt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-[13px] font-medium text-white"
                >
                  <ChatCircle size={15} weight="fill" />
                  Message
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white/8 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/12 hover:text-white"
                  >
                    <Flag size={14} />
                    Report
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white/8 text-[13px] font-medium text-rose-400 transition-colors hover:bg-rose-500/15"
                  >
                    <Prohibit size={14} />
                    Block
                  </button>
                </div>
              </motion.div> */}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

function Avatar({ thread, size = 'sm' }: { thread: ChatThread; size?: 'sm' | 'md' }) {
  const box = size === 'md' ? 'size-10 text-[12px]' : 'size-10 text-[11px]'
  return (
    <span className={cn(box, 'relative shrink-0')}>
      {thread.avatar ? (
        <img src={thread.avatar} alt="" className="size-full rounded-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center rounded-full bg-white/10 font-semibold tracking-wide text-white">
          {thread.initials}
        </span>
      )}
      <span
        className={cn(
          'absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-black',
          presenceClass(thread.presence),
        )}
        aria-label={thread.presence}
      />
    </span>
  )
}

function presenceClass(presence: ChatPresence) {
  if (presence === 'online') return 'bg-yield-bright'
  if (presence === 'away') return 'bg-amber-400'
  return 'bg-white/35'
}

function presenceLabel(presence: ChatPresence) {
  if (presence === 'online') return 'Online'
  if (presence === 'away') return 'Away'
  return 'Offline'
}

function formatDuration(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
