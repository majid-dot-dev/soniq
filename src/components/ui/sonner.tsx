import {
  CheckCircle,
  Info,
  SpinnerGap,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/lib/utils'

export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      gap={10}
      offset={20}
      visibleToasts={3}
      className={cn('toaster group', className)}
      icons={{
        success: <CheckCircle size={18} weight="fill" className="text-yield-bright" />,
        error: <XCircle size={18} weight="fill" className="text-rose-400" />,
        warning: <WarningCircle size={18} weight="fill" className="text-ember-bright" />,
        info: <Info size={18} weight="fill" className="text-white/70" />,
        loading: <SpinnerGap size={18} className="animate-spin text-white/55" />,
      }}
      toastOptions={{
        classNames: {
          toast: cn(
            'group/toast',
            '!flex !items-center !gap-1 !w-[min(100vw-2rem,24rem)]',
            '!rounded-2xl !border-0 !p-4',
            '!bg-white/10 !text-white !shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]',
            '!backdrop-blur-2xl !ring-0',
          ),
          title: '!text-[13.5px] !font-medium !tracking-[-0.01em] !text-white',
          description: '!text-[12.5px] !leading-snug !text-white/60',
          icon: '!mt-0 !size-[18px] !shrink-0',
          actionButton: cn(
            '!h-8 !rounded-full !border-0 !px-3 !text-[12px] !font-medium',
            '!bg-linear-to-b !from-rose-600 !via-rose-500 !to-rose-500/85 !text-white',
          ),
          cancelButton: cn(
            '!h-8 !rounded-full !border-0 !bg-white/10 !px-3 !text-[12px] !font-medium !text-white/75',
            'hover:!bg-white/15 hover:!text-white',
          ),
        },
      }}
      {...props}
    />
  )
}
