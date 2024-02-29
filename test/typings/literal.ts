import { assert, literal } from '../../src';
import { test } from '../index.test';

test<true>((value) => {
  assert(value, literal(true));
  return value;
});

test<'a'>((value) => {
  assert(value, literal('a'));
  return value;
});

test<42>((value) => {
  assert(value, literal(42));
  return value;
});

test<Date>((value) => {
  assert(value, literal(new Date()));
  return value;
});
