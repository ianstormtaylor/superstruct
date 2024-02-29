import { deprecated, number } from '../../../src';

export const Struct = deprecated(number(), () => {
  /* noop */
});

export const data = 42;

export const output = 42;
