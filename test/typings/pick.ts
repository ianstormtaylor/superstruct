import { assert, pick, object, number, string } from '../../src';
import { test } from '../index.test';

test<{
  b: string;
}>((value) => {
  assert(value, pick(object({ a: number(), b: string() }), ['b']));
  return value;
});
