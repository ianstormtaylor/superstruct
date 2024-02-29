import { assert, assign, object, number, string } from '../../src';
import { test } from '../index.test';

test<{
  a: number;
  b: string;
}>((value) => {
  assert(value, assign(object({ a: number() }), object({ b: string() })));
  return value;
});
