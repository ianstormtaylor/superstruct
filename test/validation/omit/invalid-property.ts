import { omit, object, string, number } from '../../../src';

export const Struct = omit(
  object({
    name: string(),
    age: number(),
  }),
  ['name'],
);

export const data = {
  age: 'invalid',
};

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['age'],
    branch: [data, data.age],
  },
];
