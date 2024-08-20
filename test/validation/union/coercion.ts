import { create } from "../../../src";
import { expect, test } from "vitest";
import { union, string, number, defaulted } from '../../../src'

const A = defaulted(string(), 'foo')
const B = number()

test("Coercion union", () => {
  const data = undefined;
  const res = create(data, union([A, B]));
  expect(res).toStrictEqual('foo');
});
