import { assert, type, number } from '../../src';
import { test } from '../index.test';

test<{ a: number }>((value) => {
  assert(value, type({ a: number() }));
  return value;
});
