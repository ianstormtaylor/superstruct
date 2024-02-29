import { deepStrictEqual, throws } from 'assert';
import { describe, it } from 'vitest';

import {
  mask,
  object,
  string,
  defaulted,
  StructError,
  array,
  type,
} from '../../src';

describe('mask', () => {
  it('object as helper', () => {
    const struct = object({ id: string() });
    const value = { id: '1', unknown: true };
    deepStrictEqual(mask(value, struct), { id: '1' });
  });

  it('non-object as helper', () => {
    const struct = object({ id: string() });
    const value = 'invalid';
    throws(() => {
      mask(value, struct);
    }, StructError);
  });

  it('coercing', () => {
    const struct = defaulted(object({ id: string() }), { id: '0' });
    const value = { unknown: true };
    deepStrictEqual(mask(value, struct), { id: '0' });
  });

  it('deep masking of objects', () => {
    const struct = object({
      id: string(),
      sub: array(object({ prop: string() })),
    });
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    };
    deepStrictEqual(mask(value, struct), { id: '1', sub: [{ prop: '2' }] });
  });

  it('masking of a nested type', () => {
    const struct = object({
      id: string(),
      sub: array(type({ prop: string() })),
    });
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    };
    deepStrictEqual(mask(value, struct), {
      id: '1',
      sub: [{ prop: '2', unknown: true }],
    });
  });

  it('masking of a top level type and nested object', () => {
    const struct = type({
      id: string(),
      sub: array(object({ prop: string() })),
    });
    const value = {
      id: '1',
      unknown: true,
      sub: [{ prop: '2', unknown: true }],
    };
    deepStrictEqual(mask(value, struct), {
      id: '1',
      unknown: true,
      sub: [{ prop: '2' }],
    });
  });

  it('masking does not change the original value', () => {
    const struct = object({ id: string() });
    const value = { id: '1', unknown: true };
    deepStrictEqual(mask(value, struct), { id: '1' });
    deepStrictEqual(value, { id: '1', unknown: true });
  });

  it('custom error message', () => {
    throws(() => string().mask(42, 'Not a string!'), {
      cause: 'Expected a string, but received: 42',
      message: 'Not a string!',
    });
  });
});
