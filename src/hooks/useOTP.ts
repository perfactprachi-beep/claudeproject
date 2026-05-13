import { useState, useEffect, useRef } from 'react'

const OTP_RESEND_SECONDS = 30

export function useOTP() {
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startTimer = () => {
    clearTimer()
    setTimer(OTP_RESEND_SECONDS)
    setCanResend(false)

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearTimer()
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearTimer(), [])

  return { timer, canResend, startTimer }
}
