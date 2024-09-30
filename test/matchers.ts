import { isEqual, pick } from 'lodash'
import { expect } from 'vitest'
import { StructError } from '../src'

const FILTERED_PROPS = ['type', 'path', 'refinement', 'value', 'branch']

expect.extend({
  toMatchStructError: (received: StructError | undefined, expected: any) => {
    // Make sure the error exists
    if (!(received instanceof StructError)) {
      return {
        message: () => `Expected error to be a StructError`,
        pass: false,
        actual: received,
        expected,
      }
    }

    const actualFailures = received
      .failures()
      .map((failure) => pick(failure, ...FILTERED_PROPS))

    // Check that the failures match
    if (!isEqual(actualFailures, expected)) {
      return {
        message: () => `Expected error.failures to match expected`,
        pass: false,
        actual: actualFailures,
        expected,
      }
    }

    const strippedError = pick(received, ...FILTERED_PROPS)

    // Check that the first failure properties are also the properties of the StructError
    if (!isEqual(strippedError, expected[0])) {
      return {
        message: () =>
          `Expected error properties to match first expected failure`,
        pass: false,
        actual: strippedError,
        expected,
      }
    }

    return {
      message: () => `${received} matches ${expected}`,
      pass: true,
    }
  },
})

interface CustomMatchers {
  toMatchStructError: (expected: any) => void
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
