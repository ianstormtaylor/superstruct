import { string, pattern } from '../../../src';

export const Struct = pattern(string(), /\d+/u);

export const data = '123';

export const output = '123';
