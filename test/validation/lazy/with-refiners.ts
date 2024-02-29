import { lazy, nonempty, string } from '../../../src';

export const Struct = lazy(() => nonempty(string()));

export const data = '';

export const failures = [
  {
    value: data,
    type: 'string',
    refinement: 'nonempty',
    path: [],
    branch: [data],
  },
];
