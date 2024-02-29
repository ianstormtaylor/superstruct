import { assert, object, number } from '../../src';
import { test } from '../index.test';

test<{ a?: number }>((value) => {
  assert(value, object({ a: number() }));
  return value;
});
