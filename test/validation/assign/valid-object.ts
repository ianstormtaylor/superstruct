import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, assign, string, number } from '../../../src'

const A = type({ a: string() })
const B = type({ a: number(), b: number() })

test("Valid assign object", () => {
  const data = {
    a: 1,
    b: 2,
  };

  assert(data, assign(A, B));

  expect(data).toStrictEqual({
    a: 1,
    b: 2,
  });
});
