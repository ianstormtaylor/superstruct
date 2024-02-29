import { throws, doesNotThrow } from 'assert';
import { describe, it } from 'vitest';

import { assert, string, StructError } from '../../src';

describe('assert', () => {
  it('valid as helper', () => {
    doesNotThrow(() => {
      assert('valid', string());
    });
  });

  it('valid as method', () => {
    doesNotThrow(() => {
      // @ts-expect-error - Testing invalid input.
      string().assert('valid');
    });
  });

  it('invalid as helper', () => {
    throws(() => {
      assert(42, string());
    }, StructError);
  });

  it('invalid as method', () => {
    throws(() => {
      // @ts-expect-error - Testing invalid input.
      string().assert(42);
    }, StructError);
  });

  it('custom error message', () => {
    throws(() => string().assert(42, 'Not a string!'), {
      cause: 'Expected a string, but received: 42',
      message: 'Not a string!',
    });
  });
});
