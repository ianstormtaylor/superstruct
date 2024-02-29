import { assert, instance } from '../../src';
import { test } from '../index.test';

test<Date>((value) => {
  assert(value, instance(Date));
  return value;
});
