import { map, size, number, string } from '../../../src';

export const Struct = size(map(number(), string()), 1, 5);

export const data = new Map();

export const failures = [
  {
    value: data,
    type: 'map',
    refinement: 'size',
    path: [],
    branch: [data],
  },
];
