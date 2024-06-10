import { describe, it } from 'vitest'
import { CallTracker } from 'assert'
import { any, assert, Context, deprecated } from '../src'

describe('deprecated', () => {
  it('does not log deprecated type if value is undefined', () => {
    const tracker = new CallTracker()
    const logSpy = buildSpyWithZeroCalls(tracker)
    assert(undefined, deprecated(any(), logSpy))
    tracker.verify()
  })

  it('logs deprecated type to passed function if value is present', () => {
    const tracker = new CallTracker()
    const fakeLog = (value: unknown, ctx: Context) => {}
    const logSpy = tracker.calls(fakeLog, 1)
    assert('present', deprecated(any(), logSpy))
    tracker.verify()
  })
})

/**
 * This emulates `tracker.calls(0)`.
 *
 * `CallTracker.calls` doesn't support passing `0`, therefore we expect it
 * to be called once which is our call in this test. This proves that
 * the following action didn't call it.
 */
function buildSpyWithZeroCalls(tracker: CallTracker) {
  const logSpy = tracker.calls(1)
  logSpy()
  return logSpy
}
