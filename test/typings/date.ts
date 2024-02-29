import { assert, date } from '../../src';
import { test } from '../index.test';

test<Date>((value) => {
  assert(value, date());
  return value;
});
