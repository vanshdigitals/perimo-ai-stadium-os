/**
 * OtpInput — reusable 6-digit code entry, used by MFA and reset-OTP screens.
 */
import React, { useRef } from 'react'

interface OtpInputProps {
  length?: number
  onChange?: (value: string) => void
  autoFocus?: boolean
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange, autoFocus = true }) => {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const handleInput = (idx: number, e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.replace(/\D/g, '').slice(-1)
    e.currentTarget.value = val
    if (val && idx < length - 1) {
      refs.current[idx + 1]?.focus()
    }
    emitChange()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    text.split('').forEach((char, i) => {
      if (refs.current[i]) refs.current[i]!.value = char
    })
    refs.current[Math.min(text.length, length - 1)]?.focus()
    emitChange()
  }

  const emitChange = () => {
    if (!onChange) return
    const value = refs.current.map((r) => r?.value ?? '').join('')
    onChange(value)
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { refs.current[idx] = el }}
          name={`otp_${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && idx === 0}
          required
          onInput={(e) => handleInput(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="w-full h-[52px] text-center border border-surface-border rounded-lg text-xl font-mono text-text bg-white focus:outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/10 transition-shadow"
        />
      ))}
    </div>
  )
}
