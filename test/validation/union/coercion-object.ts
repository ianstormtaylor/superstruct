import { union, string, number, defaulted, object } from '../../../src';

const First = string();
const Second = object({ a: number(), b: defaulted(number(), 5) });

export const Struct = union([First, Second]);

export const data = { a: 5 };

export const output = { a: 5, b: 5 };

export const create = true;
