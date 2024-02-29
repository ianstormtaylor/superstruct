import { assert, object, deprecated, any } from '../../src';
import { test } from '../index.test';

test<unknown>((value) => {
  const log = () => {
    /* noop */
  };

  assert(value, deprecated(any(), log));
  return value;
});

test<{ a?: unknown }>((value) => {
  const log = () => {
    /* noop */
  };

  assert(value, object({ a: deprecated(any(), log) }));
  return value;
});
