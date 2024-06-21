import { describe, expect, it, vi } from 'vitest'
import { any, assert, deprecated } from '../src'

describe('deprecated', () => {
  it('does not log deprecated type if value is undefined', () => {
    const spy = vi.fn()
    expect(spy).not.toHaveBeenCalled()
    assert(undefined, deprecated(any(), spy))
    expect(spy).not.toHaveBeenCalled()
  })

  it('logs deprecated type to passed function if value is present', () => {
    const spy = vi.fn()
    expect(spy).not.toHaveBeenCalled()
    assert('present', deprecated(any(), spy))
    expect(spy).toHaveBeenCalledOnce()
  })
})
