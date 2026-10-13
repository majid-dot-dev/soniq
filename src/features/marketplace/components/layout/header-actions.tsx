import { useAuth } from '@/features/auth/auth-provider'
import { NotificationsMenu } from '@/features/dashboard/components/notifications-menu'
import { CartDropdown } from '@/features/marketplace/components/cart-dropdown'
import { AccountMenu } from '@/features/marketplace/components/layout/account-menu'

export function HeaderActions({
  compact,
  hideCart,
}: {
  compact?: boolean
  hideCart?: boolean
}) {
  const { status } = useAuth()
  const authenticated = status === 'authenticated'

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1.5">
        {hideCart ? null : <CartDropdown />}
        {authenticated ? <NotificationsMenu /> : null}
      </div>
      {authenticated ? (
        <span aria-hidden className="mx-1.5 h-4 w-px shrink-0 self-center bg-white/12" />
      ) : hideCart ? null : (
        <span aria-hidden className="w-1.5 shrink-0" />
      )}
      <AccountMenu compact={compact} />
    </div>
  )
}
