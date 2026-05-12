import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-brand-red text-white hover:bg-[#A8001A] focus-visible:ring-brand-red',
  secondary: 'bg-white text-brand-red border-[1.5px] border-brand-red hover:bg-[#FFF0F2] focus-visible:ring-brand-red',
  ghost:     'bg-transparent text-gray-900 border border-[#E8E8E8] hover:bg-[#F5F5F5] focus-visible:ring-gray-400',
  danger:    'bg-danger text-white hover:bg-red-600 focus-visible:ring-danger',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-lg',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded font-sans font-semibold tracking-wide',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isDisabled
          ? 'bg-[#E8E8E8] text-[#999] cursor-not-allowed border-transparent'
          : variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1" aria-label="Loading">
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
        </span>
      ) : (
        children
      )}
    </button>
  )
}
