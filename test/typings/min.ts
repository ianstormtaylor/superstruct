import { assert, number, min } from '../../src';
import { test } from '../index.test';

test<number>((value) => {
  assert(value, min(number(), 0));
  return value;
});
