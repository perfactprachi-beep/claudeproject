import { act, renderHook } from '@testing-library/react'
import { useOTP } from '@hooks/useOTP'

jest.useFakeTimers()

afterEach(() => jest.clearAllTimers())

describe('useOTP', () => {
  it('starts with timer=0 and canResend=false', () => {
    const { result } = renderHook(() => useOTP())
    expect(result.current.timer).toBe(0)
    expect(result.current.canResend).toBe(false)
  })

  it('sets timer to 30 and canResend=false after startTimer', () => {
    const { result } = renderHook(() => useOTP())
    act(() => result.current.startTimer())
    expect(result.current.timer).toBe(30)
    expect(result.current.canResend).toBe(false)
  })

  it('decrements timer every second', () => {
    const { result } = renderHook(() => useOTP())
    act(() => result.current.startTimer())
    act(() => jest.advanceTimersByTime(5000))
    expect(result.current.timer).toBe(25)
  })

  it('sets canResend=true and timer=0 when countdown reaches 0', () => {
    const { result } = renderHook(() => useOTP())
    act(() => result.current.startTimer())
    act(() => jest.advanceTimersByTime(30000))
    expect(result.current.timer).toBe(0)
    expect(result.current.canResend).toBe(true)
  })

  it('resets the countdown when startTimer is called again', () => {
    const { result } = renderHook(() => useOTP())
    act(() => result.current.startTimer())
    act(() => jest.advanceTimersByTime(15000))
    act(() => result.current.startTimer())
    expect(result.current.timer).toBe(30)
    expect(result.current.canResend).toBe(false)
  })

  it('clears the interval on unmount (no memory leak)', () => {
    const clearSpy = jest.spyOn(global, 'clearInterval')
    const { result, unmount } = renderHook(() => useOTP())
    act(() => result.current.startTimer())
    unmount()
    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
