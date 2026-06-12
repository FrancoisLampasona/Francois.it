import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useGreetingCycle } from './useGreetingCycle'

describe('useGreetingCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at index 0', () => {
    const onDone = vi.fn()
    const { result } = renderHook(() => useGreetingCycle(3, 100, onDone))
    expect(result.current).toBe(0)
    expect(onDone).not.toHaveBeenCalled()
  })

  it('advances index after each interval', () => {
    const onDone = vi.fn()
    const { result } = renderHook(() => useGreetingCycle(5, 200, onDone))

    expect(result.current).toBe(0)

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(1)

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(2)

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(3)
  })

  it('calls onDone exactly once after the last greeting and does not exceed count-1', () => {
    const onDone = vi.fn()
    const COUNT = 3
    const { result } = renderHook(() => useGreetingCycle(COUNT, 100, onDone))

    // After count-1 ticks we reach the last greeting (index 2)
    act(() => { vi.advanceTimersByTime(100 * (COUNT - 1)) })
    expect(result.current).toBe(COUNT - 1)
    expect(onDone).not.toHaveBeenCalled()

    // One more tick triggers onDone and index stays at count-1
    act(() => { vi.advanceTimersByTime(100) })
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(result.current).toBe(COUNT - 1)

    // Further ticks do nothing
    act(() => { vi.advanceTimersByTime(500) })
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(result.current).toBe(COUNT - 1)
  })

  it('cleans up the interval on unmount', () => {
    const onDone = vi.fn()
    const { unmount } = renderHook(() => useGreetingCycle(5, 100, onDone))
    unmount()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(onDone).not.toHaveBeenCalled()
  })
})
