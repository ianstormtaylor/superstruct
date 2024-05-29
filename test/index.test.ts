// eslint-disable-next-line n/no-unsupported-features/node-builtins
import assert, { CallTracker } from 'assert';
import fs from 'fs';
import { pick } from 'lodash';
import { basename, extname, resolve } from 'path';
import { describe, it } from 'vitest';

import {
  any,
  assert as assertValue,
  create as createValue,
  deprecated,
  StructError,
} from '../src';

describe('superstruct', () => {
  describe('validation', () => {
    const kindsDir = resolve(__dirname, 'validation');
    // eslint-disable-next-line n/no-sync
    const kinds = fs
      .readdirSync(kindsDir)
      .filter((name) => !name.startsWith('.'))
      .map((name) => basename(name, extname(name)));

    for (const kind of kinds) {
      describe(kind, async () => {
        const testsDir = resolve(kindsDir, kind);
        // eslint-disable-next-line n/no-sync
        const tests = fs
          .readdirSync(testsDir)
          .filter((name) => !name.startsWith('.'))
          .map((name) => basename(name, extname(name)));

        for (const name of tests) {
          const testModule = await import(resolve(testsDir, name));
          const { Struct, data, create, only, skip, output, failures } =
            testModule;

          // eslint-disable-next-line no-nested-ternary
          const run = only ? it.only : skip ? it.skip : it;
          run(name, () => {
            let actual;
            let error;

            try {
              if (create) {
                actual = createValue(data, Struct);
              } else {
                assertValue(data, Struct);
                actual = data;
              }
            } catch (assertionError) {
              if (!(assertionError instanceof StructError)) {
                throw assertionError;
              }

              error = assertionError;
            }

            if ('output' in testModule) {
              if (error) {
                throw new Error(
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  `Expected "${name}" fixture not to throw an error but it did:\n\n${error}`,
                );
              }

              assert.deepStrictEqual(actual, output);
            } else if ('failures' in testModule) {
              if (!error) {
                throw new Error(
                  `Expected "${name}" fixture to throw an error but it did not.`,
                );
              }

              const props = ['type', 'path', 'refinement', 'value', 'branch'];
              const actualFailures = error
                .failures()
                .map((failure) => pick(failure, ...props));

              assert.deepStrictEqual(actualFailures, failures);
              assert.deepStrictEqual(pick(error, ...props), failures[0]);
            } else {
              throw new Error(
                `The "${name}" fixture did not define an \`output\` or \`failures\` export.`,
              );
            }
          });
        }
      });
    }
  });

  describe('deprecated', () => {
    it('does not log deprecated type if value is undefined', () => {
      const tracker = new CallTracker();
      const logSpy = buildSpyWithZeroCalls(tracker);
      assertValue(undefined, deprecated(any(), logSpy));
      tracker.verify();
    });

    it('logs deprecated type to passed function if value is present', () => {
      const tracker = new CallTracker();
      const fakeLog = () => {
        /* noop */
      };

      const logSpy = tracker.calls(fakeLog, 1);
      assertValue('present', deprecated(any(), logSpy));
      tracker.verify();
    });
  });
});

/**
 * A helper for testing type signatures.
 *
 * @param _fn - The function to test.
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function test<Type>(_fn: (x: unknown) => Type) {
  /* noop */
}

/**
 * This emulates `tracker.calls(0)`.
 *
 * `CallTracker.calls` doesn't support passing `0`, therefore we expect it
 * to be called once which is our call in this test. This proves that
 * the following action didn't call it.
 *
 * @param tracker - The call tracker.
 * @returns The spy.
 */
function buildSpyWithZeroCalls(tracker: CallTracker) {
  const logSpy = tracker.calls(1);
  logSpy();
  return logSpy;
}
