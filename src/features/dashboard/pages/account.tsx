import { useMemo, useState } from 'react'
import {
  ChatCircle,
  CheckCircle,
  CopySimple,
  GearSix,
  Heart,
  InstagramLogo,
  LinkSimple,
  MapPin,
  MusicNotes,
  Play,
  SealCheck,
  ShareNetwork,
  TiktokLogo,
  TwitterLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  accountFollowers,
  accountFollowing,
  accountPosts,
  accountProfile,
  accountTabs,
  addComment,
  beatForPost,
  countComments,
  formatStat,
  socialHref,
  socialLabels,
  type AccountComment,
  type AccountPerson,
  type AccountPost,
  type AccountTab,
} from '@/features/dashboard/account'
import { beats, formatCompact } from '@/features/dashboard/beats'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 }

const socialIcons = {
  instagram: InstagramLogo,
  twitter: TwitterLogo,
  youtube: YoutubeLogo,
  tiktok: TiktokLogo,
  website: LinkSimple,
} as const

export default function Account() {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<AccountTab>('posts')
  const [followers, setFollowers] = useState(accountFollowers)
  const [following, setFollowing] = useState(accountFollowing)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const profile = accountProfile
  const featured = beats.filter((b) => b.status === 'Live').slice(0, 3)

  const tabCounts: Record<AccountTab, number> = {
    posts: profile.postsCount,
    followers: profile.followersCount,
    following: profile.followingCount,
  }

  const activeSocials = useMemo(
    () =>
      (Object.keys(profile.social) as (keyof typeof profile.social)[])
        .map((key) => {
          const value = profile.social[key]
          const href = socialHref(key, value)
          if (!href) return null
          return { key, value, href, label: socialLabels[key], Icon: socialIcons[key] }
        })
        .filter(Boolean) as {
        key: keyof typeof profile.social
        value: string
        href: string
        label: string
        Icon: (typeof socialIcons)[keyof typeof socialIcons]
      }[],
    [profile.social],
  )

  function toggleFollow(list: 'followers' | 'following', id: string) {
    const setter = list === 'followers' ? setFollowers : setFollowing
    setter((current) =>
      current.map((person) =>
        person.id === id ? { ...person, following: !person.following } : person,
      ),
    )
  }

  async function copyProfile() {
    const url = `${window.location.origin}/u/${profile.username}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="h-full min-h-0 overflow-auto">
      <motion.section
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative"
      >
        <div className="relative h-48 overflow-hidden sm:h-64 lg:h-72">
          <motion.img
            src={profile.cover}
            alt=""
            initial={reduce ? false : { scale: 1.08, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="size-full object-cover blur-[2px] brightness-75"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-rose-500/40 via-white/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-[#0c0c0e]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 lg:-mt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4 sm:gap-5">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
                className="relative shrink-0"
              >
                <img
                  src={profile.avatar}
                  alt=""
                  className="size-28 rounded-[1.35rem] object-cover shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] ring-4 ring-[#0c0c0e] sm:size-32 lg:size-36"
                />
                {profile.verified ? (
                  <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-[#0c0c0e] ring-2 ring-[#0c0c0e]">
                    <SealCheck size={20} weight="fill" className="text-rose-400" />
                  </span>
                ) : null}
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.14 }}
                className="min-w-0 pb-1"
              >
                <p className="text-[12px] font-medium tracking-[0.14em] text-ink-mute uppercase">
                  {profile.role}
                </p>
                <h1 className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[30px] leading-none font-semibold tracking-[-0.045em] text-white sm:text-[38px] lg:text-[42px]">
                  {profile.displayName}
                </h1>
                <p className="mt-2 text-[14px] text-ink-mute">@{profile.username}</p>
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.18 }}
              className="flex flex-wrap items-center gap-2 pb-1 lg:justify-end"
            >
              <button
                type="button"
                onClick={copyProfile}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white/8 px-4 text-[13px] font-medium text-ink-2 ring-1 ring-white/10 transition-colors hover:bg-white/12 hover:text-white"
              >
                {copied ? <CheckCircle size={15} weight="fill" className="text-emerald-400" /> : <CopySimple size={15} />}
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-white/8 text-ink-2 ring-1 ring-white/10 transition-colors hover:bg-white/12 hover:text-white"
                aria-label="Share profile"
              >
                <ShareNetwork size={16} />
              </button>
              <Link
                to="/settings"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 text-[13px] font-medium text-white shadow-[0_10px_28px_-12px_rgba(244,63,94,0.7)] transition-[filter] hover:brightness-110"
              >
                <GearSix size={15} />
                Edit profile
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
            className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10"
          >
            <div className="min-w-0">
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">{profile.bio}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-mute">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {profile.location}
                </span>
                <span>Joined {format(new Date(profile.joinedAt), 'MMM yyyy')}</span>
                {activeSocials.length > 0 ? (
                  <span className="flex items-center gap-1">
                    {activeSocials.map(({ key, href, label, Icon }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        title={label}
                        className="inline-flex size-8 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </span>
                ) : null}
              </div>

              {profile.genres.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-white/6 px-2.5 py-1 text-[12px] font-medium text-ink-2 ring-1 ring-white/8"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-7 flex gap-8 border-b border-white/8">
                {accountTabs.map((item) => {
                  const active = tab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={cn(
                        'relative pb-3 text-[13px] font-medium transition-colors',
                        active ? 'text-white' : 'text-ink-mute hover:text-white',
                      )}
                    >
                      {item.label}
                      <span className="ml-1.5 text-ink-faint tnum">{formatStat(tabCounts[item.id])}</span>
                      {active ? (
                        <motion.span
                          layoutId="account-tab-line"
                          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-rose-400"
                          transition={SPRING}
                        />
                      ) : null}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="pt-5 pb-10"
                >
                  {tab === 'posts' ? (
                    <div className="flex flex-col gap-4">
                      <Composer
                        avatar={profile.avatar}
                        value={draft}
                        onChange={setDraft}
                        reduce={!!reduce}
                      />
                      {accountPosts.map((post, index) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          index={index}
                          reduce={!!reduce}
                          liked={!!liked[post.id]}
                          onToggleLike={() =>
                            setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                          }
                        />
                      ))}
                    </div>
                  ) : null}

                  {tab === 'followers' ? (
                    <PeopleList
                      people={followers}
                      empty="No followers yet."
                      onToggle={(id) => toggleFollow('followers', id)}
                      reduce={!!reduce}
                    />
                  ) : null}

                  {tab === 'following' ? (
                    <PeopleList
                      people={following}
                      empty="Not following anyone yet."
                      onToggle={(id) => toggleFollow('following', id)}
                      reduce={!!reduce}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="hidden pb-10 lg:block">
              <div className="sticky top-6 space-y-6">
                <div>
                  <p className="text-[12px] font-medium tracking-[0.12em] text-ink-mute uppercase">
                    Snapshot
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <SideStat label="Posts" value={formatStat(profile.postsCount)} />
                    <SideStat label="Followers" value={formatStat(profile.followersCount)} />
                    <SideStat label="Following" value={formatStat(profile.followingCount)} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-medium tracking-[0.12em] text-ink-mute uppercase">
                      On the shelf
                    </p>
                    <Link to="/tracks" className="text-[12px] text-ink-mute transition-colors hover:text-white">
                      View all
                    </Link>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {featured.map((beat, index) => (
                      <motion.div
                        key={beat.id}
                        initial={reduce ? false : { opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: reduce ? 0 : 0.25 + index * 0.05,
                          ease: EASE,
                        }}
                        className="group flex items-center gap-3 rounded-2xl bg-white/4 p-2 pr-3 ring-1 ring-white/8 transition-colors hover:bg-white/7"
                      >
                        <img
                          src={beat.image}
                          alt=""
                          className="size-12 rounded-xl object-cover ring-1 ring-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-white">{beat.title}</p>
                          <p className="mt-0.5 truncate text-[11px] text-ink-mute">
                            {formatCompact(beat.plays)} plays · {beat.fromPrice}
                          </p>
                        </div>
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/8 text-ink-mute opacity-0 transition-opacity group-hover:opacity-100">
                          <Play size={12} weight="fill" />
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

function SideStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/4 px-3 py-3 ring-1 ring-white/8">
      <p className="text-[16px] font-semibold tracking-[-0.03em] text-white tnum">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-mute">{label}</p>
    </div>
  )
}

function Composer({
  avatar,
  value,
  onChange,
  reduce,
}: {
  avatar: string
  value: string
  onChange: (value: string) => void
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="rounded-[1.35rem] bg-white/4 p-4 ring-1 ring-white/10 sm:p-5"
    >
      <div className="flex gap-3">
        <img src={avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            placeholder="Share a drop, studio note, or placement…"
            className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-white outline-none placeholder:text-ink-faint"
          />
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
            >
              <MusicNotes size={14} />
              Attach track
            </button>
            <button
              type="button"
              disabled={!value.trim()}
              className="rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-4 py-1.5 text-[12px] font-medium text-white transition-[filter] enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PostCard({
  post,
  index,
  reduce,
  liked,
  onToggleLike,
}: {
  post: AccountPost
  index: number
  reduce: boolean
  liked: boolean
  onToggleLike: () => void
}) {
  const beat = beatForPost(post.beatId)
  const likes = post.likes + (liked ? 1 : 0)
  const [open, setOpen] = useState(false)
  const [thread, setThread] = useState(post.thread)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const commentCount = countComments(thread)

  function submitComment(parentId: string | null, body: string) {
    const next: AccountComment = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: {
        name: accountProfile.displayName,
        username: accountProfile.username,
        avatar: accountProfile.avatar,
        verified: accountProfile.verified,
      },
      body,
      at: new Date().toISOString(),
      likes: 0,
      replies: [],
    }
    setThread((current) => addComment(current, parentId, next))
    setReplyTo(null)
  }

  function toggleCommentHeart(id: string) {
    setLikedComments((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(index, 6) * 0.045, ease: EASE }}
      whileHover={reduce || open ? undefined : { y: -2 }}
      // className="rounded-[1.35rem] bg-white/4 p-5 ring-1 ring-white/10 transition-colors hover:bg-white/5 sm:p-6"
      className="border-b border-white/8 py-4"
    >
      <div className="flex items-start gap-3">
        <img
          src={accountProfile.avatar}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-[14px] font-medium text-white">{accountProfile.displayName}</p>
            {accountProfile.verified ? (
              <SealCheck size={14} weight="fill" className="text-rose-400" />
            ) : null}
            <p className="text-[13px] text-ink-mute">@{accountProfile.username}</p>
            <span className="text-[12px] text-ink-faint">
              · {formatDistanceToNowStrict(new Date(post.at), { addSuffix: true })}
            </span>
          </div>

          <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{post.body}</p>

          {beat ? (
            <div className="mt-4 flex overflow-hidden rounded-2xl bg-black/25 ring-1 ring-white/10">
              <img src={beat.image} alt="" className="size-19 shrink-0 object-cover" />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">{beat.title}</p>
                  <p className="mt-0.5 truncate text-[12px] text-ink-mute">
                    {beat.bpm} BPM · {beat.key} · {formatCompact(beat.plays)} plays
                  </p>
                </div>
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <Play size={13} weight="fill" />
                </span>
              </div>
            </div>
          ) : null}

          {post.image && !beat ? (
            <img
              src={post.image}
              alt=""
              className="mt-4 aspect-video w-full rounded-2xl object-cover ring-1 ring-white/10"
            />
          ) : null}

          <div className="mt-4 flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleLike}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] transition-colors',
                liked
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'text-ink-mute hover:bg-white/8 hover:text-white',
              )}
            >
              <Heart size={15} weight={liked ? 'fill' : 'regular'} />
              <span className="tnum">{likes}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] transition-colors',
                open
                  ? 'bg-white/10 text-white'
                  : 'text-ink-mute hover:bg-white/8 hover:text-white',
              )}
            >
              <ChatCircle size={15} weight={open ? 'fill' : 'regular'} />
              <span className="tnum">{commentCount}</span>
            </button>
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] text-ink-mute transition-colors hover:bg-white/8 hover:text-white"
            >
              <ShareNetwork size={15} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="comments"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-5 border-t border-white/8 pt-4">
              <CommentComposer
                placeholder="Add a comment…"
                onSubmit={(body) => submitComment(null, body)}
              />

              {thread.length === 0 ? (
                <p className="mt-4 pl-[2.625rem] text-[13px] text-ink-mute">No comments yet.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {thread.map((comment) => (
                    <CommentNode
                      key={comment.id}
                      comment={comment}
                      depth={0}
                      replyTo={replyTo}
                      likedComments={likedComments}
                      onReply={(id) => setReplyTo((current) => (current === id ? null : id))}
                      onSubmitReply={(parentId, body) => submitComment(parentId, body)}
                      onToggleLike={toggleCommentHeart}
                      onCancelReply={() => setReplyTo(null)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

/** Shared comment row: 32px avatar + 10px gap. */
const COMMENT_GAP = 'gap-2.5'

const MAX_COMMENT_DEPTH = 3

function CommentNode({
  comment,
  depth,
  replyTo,
  likedComments,
  onReply,
  onSubmitReply,
  onToggleLike,
  onCancelReply,
}: {
  comment: AccountComment
  depth: number
  replyTo: string | null
  likedComments: Record<string, boolean>
  onReply: (id: string) => void
  onSubmitReply: (parentId: string, body: string) => void
  onToggleLike: (id: string) => void
  onCancelReply: () => void
}) {
  const liked = !!likedComments[comment.id]
  const likes = comment.likes + (liked ? 1 : 0)
  const isReplying = replyTo === comment.id
  const canNest = depth < MAX_COMMENT_DEPTH
  const hasReplies = comment.replies.length > 0

  return (
    <li className="min-w-0">
      <div className={cn('flex items-start', COMMENT_GAP)}>
        <img
          src={comment.author.avatar}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/6">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-none">
              <span className="text-[13px] font-medium text-white">{comment.author.name}</span>
              {comment.author.verified ? (
                <SealCheck size={12} weight="fill" className="shrink-0 text-rose-400" />
              ) : null}
              <span className="text-[12px] text-ink-mute">@{comment.author.username}</span>
              <span className="text-[11px] text-ink-faint">
                · {formatDistanceToNowStrict(new Date(comment.at), { addSuffix: true })}
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{comment.body}</p>
          </div>

          <div className="-ml-1.5 mt-1 flex items-center">
            <button
              type="button"
              onClick={() => onToggleLike(comment.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[12px] transition-colors',
                liked
                  ? 'text-rose-300'
                  : 'text-ink-mute hover:bg-white/6 hover:text-white',
              )}
            >
              <Heart size={13} weight={liked ? 'fill' : 'regular'} />
              <span className="tnum">{likes}</span>
            </button>
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className={cn(
                'rounded-full px-1.5 py-1 text-[12px] font-medium transition-colors',
                isReplying
                  ? 'text-white'
                  : 'text-ink-mute hover:bg-white/6 hover:text-white',
              )}
            >
              Reply
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isReplying ? (
              <motion.div
                key="reply"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="mt-2"
              >
                <CommentComposer
                  placeholder={`Reply to @${comment.author.username}…`}
                  onSubmit={(body) => onSubmitReply(comment.id, body)}
                  onCancel={onCancelReply}
                  autoFocus
                  compact
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {hasReplies ? (
            <ul
              className={cn(
                'mt-3 flex flex-col gap-3',
                canNest && 'border-l border-white/10 pl-3',
              )}
            >
              {comment.replies.map((reply) => (
                <CommentNode
                  key={reply.id}
                  comment={reply}
                  depth={canNest ? depth + 1 : depth}
                  replyTo={replyTo}
                  likedComments={likedComments}
                  onReply={onReply}
                  onSubmitReply={onSubmitReply}
                  onToggleLike={onToggleLike}
                  onCancelReply={onCancelReply}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function CommentComposer({
  placeholder,
  onSubmit,
  onCancel,
  autoFocus = false,
  compact = false,
}: {
  placeholder: string
  onSubmit: (body: string) => void
  onCancel?: () => void
  autoFocus?: boolean
  compact?: boolean
}) {
  const [value, setValue] = useState('')

  function submit() {
    const body = value.trim()
    if (!body) return
    onSubmit(body)
    setValue('')
  }

  return (
    <div className={cn('flex items-start', COMMENT_GAP)}>
      <img
        src={accountProfile.avatar}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'rounded-2xl bg-white/5 ring-1 ring-white/8 focus-within:ring-white/16',
            compact ? 'px-3 py-2' : 'px-3 py-2.5',
          )}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={compact ? 1 : 2}
            autoFocus={autoFocus}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
              if (e.key === 'Escape' && onCancel) onCancel()
            }}
            className="block w-full resize-none bg-transparent text-[13px] leading-relaxed text-white outline-none placeholder:text-ink-faint"
          />
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-3 py-1 text-[12px] font-medium text-ink-mute transition-colors hover:bg-white/6 hover:text-white"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            disabled={!value.trim()}
            onClick={submit}
            className="rounded-full bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 px-3.5 py-1 text-[12px] font-medium text-white transition-[filter] enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {compact ? 'Reply' : 'Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PeopleList({
  people,
  empty,
  onToggle,
  reduce,
}: {
  people: AccountPerson[]
  empty: string
  onToggle: (id: string) => void
  reduce: boolean
}) {
  if (people.length === 0) {
    return (
      <p className="rounded-[1.35rem] bg-white/4 px-4 py-14 text-center text-[14px] text-ink-mute ring-1 ring-white/10">
        {empty}
      </p>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {people.map((person, index) => (
        <motion.div
          key={person.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: reduce ? 0 : Math.min(index, 8) * 0.035, ease: EASE }}
          className="flex items-center gap-3 rounded-[1.25rem] bg-white/4 p-3.5 ring-1 ring-white/10 transition-colors hover:bg-white/6"
        >
          <img src={person.avatar} alt="" className="size-12 shrink-0 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-white">{person.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-ink-mute">
              @{person.username} · {person.role}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-ink-faint">{person.detail}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggle(person.id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors',
              person.following
                ? 'bg-white/8 text-ink-2 ring-1 ring-white/10 hover:bg-white/12 hover:text-white'
                : 'bg-linear-to-b from-rose-600 via-rose-500 to-rose-500/85 text-white',
            )}
          >
            {person.following ? 'Following' : 'Follow'}
          </button>
        </motion.div>
      ))}
    </div>
  )
}
