import { type, assign, string, number } from '../../../src';

const First = type({ a: string() });
const Second = type({ a: number(), b: number() });

export const Struct = assign(First, Second);

export const data = {
  a: 1,
  b: 2,
};

export const output = {
  a: 1,
  b: 2,
};
