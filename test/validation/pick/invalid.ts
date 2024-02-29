import { pick, object, string, number } from '../../../src';

export const Struct = pick(
  object({
    name: string(),
    age: number(),
  }),
  ['name'],
);

export const data = 'invalid';

export const failures = [
  {
    value: 'invalid',
    type: 'object',
    refinement: undefined,
    path: [],
    branch: [data],
  },
];
