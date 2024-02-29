import { assert, bigint } from '../../src';
import { test } from '../index.test';

test<bigint>((value) => {
  assert(value, bigint());
  return value;
});
