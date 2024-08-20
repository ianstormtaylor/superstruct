import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object, assign, string, number } from '../../../src'

const A = object({ a: string() })
const B = object({ a: number(), b: number() })

test("Invalid assign object", () => {
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
    {
      branch: [data, data.c],
      path: ['c'],
      refinement: undefined,
      type: 'never',
      value: 5,
    },
  ]);
});
