import { record, string, number } from '../../../src';

export const Struct = record(string(), number());

export const data = {
  a: 1,
  b: 2,
};

export const output = {
  a: 1,
  b: 2,
};
