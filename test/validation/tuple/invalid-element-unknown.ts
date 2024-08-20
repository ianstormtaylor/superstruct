import { validate } from "../../../src";
import { expect, test } from "vitest";
import { tuple, string, number } from '../../../src'

test("Invalid tuple element unknown", () => {
  const data = ['A', 3, 'unknown'];
  const [err, res] = validate(data, tuple([string(), number()]));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'unknown',
      type: 'never',
      refinement: undefined,
      path: [2],
      branch: [data, data[2]],
    },
  ]);
});
