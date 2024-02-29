import { number, refine } from '../../../src';

export const Struct = refine(
  number(),
  'positive',
  (value) => value > 0 || 'Number was not positive!',
);

export const data = -1;

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'positive',
    path: [],
    branch: [data],
  },
];
