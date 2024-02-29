import { assert, integer } from '../../src';
import { test } from '../index.test';

test<number>((value) => {
  assert(value, integer());
  return value;
});
