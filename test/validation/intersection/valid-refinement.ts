import { intersection, refine, number } from '../../../src';

const First = number();
const Second = refine(number(), 'positive', (value) => value > 0);

export const Struct = intersection([First, Second]);

export const data = 1;

export const output = 1;
