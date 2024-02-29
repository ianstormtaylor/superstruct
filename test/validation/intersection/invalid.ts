import { type, intersection, string, number } from '../../../src';

const First = type({ a: string() });
const Second = type({ b: number() });

export const Struct = intersection([First, Second]);

export const data = {
  a: 'a',
  b: 'invalid',
};

export const failures = [
  {
    type: 'number',
    value: 'invalid',
    refinement: undefined,
    path: ['b'],
    branch: [data, data.b],
  },
];
