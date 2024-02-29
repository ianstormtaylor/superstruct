import { union, string, number, defaulted } from '../../../src';

const First = defaulted(string(), 'foo');
const Second = number();

export const Struct = union([First, Second]);

export const data = undefined;

export const output = 'foo';

export const create = true;
