import { deepStrictEqual, strictEqual } from 'assert';
import { describe, it } from 'vitest';

import {
  validate,
  string,
  StructError,
  define,
  refine,
  object,
  any,
} from '../../src';

describe('validate', () => {
  it('valid as helper', () => {
    const struct = string();
    deepStrictEqual(validate('valid', struct), [undefined, 'valid']);
  });

  it('valid as method', () => {
    const struct = string();
    deepStrictEqual(struct.validate('valid'), [undefined, 'valid']);
  });

  it('invalid as helper', () => {
    const struct = string();
    const [error, value] = validate(42, struct);
    strictEqual(value, undefined);
    strictEqual(error instanceof StructError, true);
    deepStrictEqual(Array.from(error.failures()), [
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
        explanation: undefined,
      },
    ]);
  });

  it('invalid as method', () => {
    const struct = string();
    const [error, value] = struct.validate(42);
    strictEqual(value, undefined);
    strictEqual(error instanceof StructError, true);
    deepStrictEqual(Array.from(error.failures()), [
      {
        value: 42,
        key: undefined,
        type: 'string',
        refinement: undefined,
        message: 'Expected a string, but received: 42',
        path: [],
        branch: [42],
        explanation: undefined,
      },
    ]);
  });

  it('error message path', () => {
    const struct = object({ author: object({ name: string() }) });
    const [error] = struct.validate({ author: { name: 42 } });
    strictEqual(
      (error as StructError).message,
      'At path: author.name -- Expected a string, but received: 42',
    );
  });

  it('custom error message', () => {
    const struct = string();
    const [error] = struct.validate(42, { message: 'Validation failed!' });
    strictEqual(error?.message, 'Validation failed!');
    strictEqual(error?.cause, 'Expected a string, but received: 42');
  });

  it('early exit', () => {
    let ranA = false;
    const ranB = false;

    const structA = define('A', (value) => {
      ranA = true;
      return typeof value === 'string';
    });

    const structB = define('B', (value) => {
      ranA = true;
      return typeof value === 'string';
    });

    const struct = object({ a: structA, b: structB });
    struct.validate({ a: null, b: null });
    strictEqual(ranA, true);
    strictEqual(ranB, false);
  });

  it('refiners after children', () => {
    const order: string[] = [];

    const structA = define('A', () => {
      order.push('validator');
      return true;
    });

    const structB = refine(object({ a: structA }), 'B', () => {
      order.push('refiner');
      return true;
    });

    structB.validate({ a: null });
    deepStrictEqual(order, ['validator', 'refiner']);
  });

  it('refiners even if nested refiners fail', () => {
    let ranOuterRefiner = false;

    const structA = refine(any(), 'A', () => {
      return 'inner refiner failed';
    });

    const structB = refine(object({ a: structA }), 'B', () => {
      ranOuterRefiner = true;
      return true;
    });

    const [error] = structB.validate({ a: null });
    // Collect all failures. Ensures all validation runs.
    error?.failures();
    strictEqual(ranOuterRefiner, true);
  });

  it('skips refiners if validators return errors', () => {
    let ranRefiner = false;

    const structA = define('A', () => {
      return false;
    });

    const structB = refine(object({ a: structA }), 'B', () => {
      ranRefiner = true;
      return true;
    });

    const [error] = structB.validate({ a: null });
    // Collect all failures. Ensures all validation runs.
    error?.failures();
    strictEqual(ranRefiner, false);
  });
});
