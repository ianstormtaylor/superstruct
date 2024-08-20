import { validate } from "../../../src";
import { expect, test } from "vitest";
import { type, object, assign, string, number } from '../../../src'

const A = type({ a: string() })
const B = object({ a: number(), b: number() })

test("Invalid assign type", () => {
  const data = {
    a: 'invalid',
    b: 2,
    c: 5,
  };

  const [err, res] = validate(data, assign(A, B));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: ['a'],
      branch: [data, data.a],
    },
  ]);
});
