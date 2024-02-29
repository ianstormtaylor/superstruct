import { assert, nullable, string, object, enums } from '../../src';
import { test } from '../index.test';

test<string | null>((value) => {
  assert(value, nullable(string()));
  return value;
});

test<{ a: string | null }>((value) => {
  assert(value, object({ a: nullable(string()) }));
  return value;
});

test<{
  a: 'a';
  b: 'b';
}>(() => {
  return nullable(enums(['a', 'b'])).schema;
});
