import { Zap } from 'lucide-react'
import { cn } from '@utils/cn'

interface FCPointsBadgeProps {
  points: number
  /** 'earn' shows "+N pts", 'balance' shows "N FC pts" */
  mode?: 'earn' | 'balance'
  size?: 'sm' | 'md'
  className?: string
}

export function FCPointsBadge({ points, mode = 'earn', size = 'md', className }: FCPointsBadgeProps) {
  const isSmall = size === 'sm'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-sans font-semibold',
        'bg-[#FFF5F5] border border-[#FFD7D7] text-[#C0001D]',
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
      aria-label={mode === 'earn' ? `Earn ${points} First Citizen points` : `${points} First Citizen points balance`}
    >
      <Zap size={isSmall ? 10 : 12} className="shrink-0" aria-hidden />
      <span className="font-mono">
        {mode === 'earn' ? `+${points}` : points.toLocaleString('en-IN')}
      </span>
      <span>{mode === 'earn' ? 'FC pts' : 'FC pts'}</span>
    </div>
  )
}
