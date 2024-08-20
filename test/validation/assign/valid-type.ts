import { assert } from "../../../src";
import { expect, test } from "vitest";
import { type, object, assign, string, number } from '../../../src'

const A = type({ a: string() })
const B = object({ b: number() })

test("Valid assign type", () => {
  const data = {
    a: '1',
    b: 2,
    c: 3,
  };

  assert(data, assign(A, B));

  expect(data).toStrictEqual({
    a: '1',
    b: 2,
    c: 3,
  });
});
