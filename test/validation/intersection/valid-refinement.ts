import { assert } from "../../../src";
import { expect, test } from "vitest";
import { intersection, refine, number } from '../../../src'

const A = number()
const B = refine(number(), 'positive', (value) => value > 0)

test("Valid intersection refinement", () => {
  const data = 1;
  assert(data, intersection([A, B]));
  expect(data).toStrictEqual(1);
});
