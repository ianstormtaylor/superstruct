import { string, pattern } from '../../../src';

export const Struct = pattern(string(), /\d+/u);

export const data = 'invalid';

export const failures = [
  {
    value: 'invalid',
    type: 'string',
    refinement: 'pattern',
    path: [],
    branch: [data],
  },
];
