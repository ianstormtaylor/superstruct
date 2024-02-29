import { assert, coerce, string, number } from '../../src';
import { test } from '../index.test';

test<number>((value) => {
  assert(
    value,
    coerce(number(), string(), (coercionValue) => parseFloat(coercionValue)),
  );
  return value;
});
