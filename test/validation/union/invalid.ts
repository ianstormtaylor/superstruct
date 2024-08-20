import { validate } from "../../../src";
import { expect, test } from "vitest";
import { type, union, string, number } from '../../../src'

const A = type({ a: string() })
const B = type({ b: number() })

test("Invalid union", () => {
  const data = {
    b: 'invalid',
  };

  const [err, res] = validate(data, union([A, B]));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: { b: 'invalid' },
      type: 'union',
      refinement: undefined,
      path: [],
      branch: [data],
    },
    {
      value: undefined,
      type: 'string',
      refinement: undefined,
      path: ['a'],
      branch: [data, undefined],
    },
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: ['b'],
      branch: [data, data.b],
    },
  ]);
});
