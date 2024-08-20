import { validate } from "../../../src";
import { expect, test } from "vitest";
import { set, empty, number } from '../../../src'

test("Invalid empty set", () => {
  const data = new Set([1, 2, 3]);
  const [err, res] = validate(data, empty(set(number())));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'set',
      refinement: 'empty',
      path: [],
      branch: [data],
    },
  ]);
});
