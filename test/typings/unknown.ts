import { assert, unknown } from '../../src';
import { test } from '../index.test';

test<unknown>((value) => {
  assert(value, unknown());
  return value;
});
