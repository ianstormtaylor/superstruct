import { assert, number } from '../../src';
import { test } from '../index.test';

test<number>((value) => {
  assert(value, number());
  return value;
});
