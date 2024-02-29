import { strictEqual, deepEqual, deepStrictEqual, throws } from 'assert';
import { describe, it } from 'vitest';

import {
  type,
  optional,
  create,
  string,
  defaulted,
  literal,
  coerce,
} from '../../src';

describe('create', () => {
  it('missing as helper', () => {
    const struct = defaulted(string(), 'default');
    strictEqual(create(undefined, struct), 'default');
  });

  it('missing as method', () => {
    const struct = defaulted(string(), 'default');
    strictEqual(struct.create(undefined), 'default');
  });

  it('not missing as helper', () => {
    const struct = defaulted(string(), 'default');
    strictEqual(create('string', struct), 'string');
  });

  it('not missing as method', () => {
    const struct = defaulted(string(), 'default');
    strictEqual(struct.create('string'), 'string');
  });

  it('missing optional fields remain missing', () => {
    const struct = type({
      a: string(),
      b: optional(string()),
      c: optional(type({ d: string() })),
    });
    deepEqual(struct.create({ a: 'a' }), { a: 'a' });
  });

  it('explicit undefined values are kept', () => {
    const struct = type({
      a: string(),
      b: coerce(optional(string()), literal(null), () => undefined),
      c: optional(type({ d: string() })),
    });
    deepStrictEqual(struct.create({ a: 'a', b: null, c: undefined }), {
      a: 'a',
      b: undefined,
      c: undefined,
    });
  });

  it('custom error message', () => {
    throws(() => string().create(42, 'Not a string!'), {
      cause: 'Expected a string, but received: 42',
      message: 'Not a string!',
    });
  });
});
