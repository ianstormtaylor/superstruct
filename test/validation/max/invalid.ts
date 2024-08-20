import { validate } from "../../../src";
import { expect, test } from "vitest";
import { number, max } from '../../../src'

test("Invalid max", () => {
  const data = 1;
  const [err, res] = validate(data, max(number(), 0));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 1,
      type: 'number',
      refinement: 'max',
      path: [],
      branch: [data],
    },
  ]);
});
