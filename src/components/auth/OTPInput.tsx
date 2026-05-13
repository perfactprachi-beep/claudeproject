import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react'
import { cn } from '@utils/cn'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  hasError?: boolean
}

export const OTPInput = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}: OTPInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const focusAt = (index: number) => {
    inputsRef.current[Math.max(0, Math.min(index, length - 1))]?.focus()
  }

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    onChange(next.join(''))
    if (digit) focusAt(index + 1)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        onChange(next.join(''))
      } else {
        focusAt(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      focusAt(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    focusAt(Math.min(pasted.length, length - 1))
  }

  return (
    <div className="flex gap-2 sm:gap-3" role="group" aria-label="OTP input">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-lg border-2 outline-none transition-all duration-150',
            'focus:border-brand-red focus:ring-2 focus:ring-brand-red/20',
            hasError
              ? 'border-danger text-danger bg-red-50'
              : digit
              ? 'border-brand-red bg-white text-brand-navy'
              : 'border-[#E0E0E0] bg-[#FAFAF8] text-gray-900',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  )
}
