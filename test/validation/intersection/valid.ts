import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, intersection, string, number } from '../../../src'

const A = type({ a: string() })
const B = type({ b: number() })

test("Valid intersection", () => {
  const data = {
    a: 'a',
    b: 42,
  };

  assert(data, intersection([A, B]));

  expect(data).toStrictEqual({
    a: 'a',
    b: 42,
  });
});
