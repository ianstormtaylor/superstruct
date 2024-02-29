import { number, array, size } from '../../../src';

export const Struct = size(array(number()), 1, 5);

export const data = [1, 2, 3];

export const output = [1, 2, 3];
