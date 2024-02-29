import { type, intersection, string, number } from '../../../src';

const First = type({ a: string() });
const Second = type({ b: number() });

export const Struct = intersection([First, Second]);

export const data = {
  a: 'a',
  b: 42,
};

export const output = {
  a: 'a',
  b: 42,
};
