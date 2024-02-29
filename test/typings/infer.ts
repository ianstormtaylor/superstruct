import type { Infer } from '../../src';
import { object, assert } from '../../src';
import { test } from '../index.test';

const Struct = object();
type T = Infer<typeof Struct>;

test<T>((value) => {
  assert(value, Struct);
  return value;
});
