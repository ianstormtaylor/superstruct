import { type, object, assign, string, number } from '../../../src';

const First = type({ a: string() });
const Second = object({ a: number(), b: number() });

export const Struct = assign(First, Second);

export const data = {
  a: 'invalid',
  b: 2,
  c: 5,
};

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['a'],
    branch: [data, data.a],
  },
];
