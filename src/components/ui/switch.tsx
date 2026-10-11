import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from 'cn'

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default'
}) {
  const large = size === 'default'

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full border-0 p-0.5 transition-colors outline-none focus-visible:outline-none data-checked:bg-rose-500 data-unchecked:bg-white/15 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        large ? 'h-5 w-9' : 'h-3.5 w-6',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block shrink-0 rounded-full bg-white transition-transform data-unchecked:translate-x-0',
          large ? 'size-4 data-checked:translate-x-4' : 'size-2.5 data-checked:translate-x-2.5',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
