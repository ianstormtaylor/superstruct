import { validate } from "../../../src";
import { expect, test } from "vitest";
import { number, optional } from '../../../src'

test("Invalid optional", () => {
  const data = 'invalid';
  const [err, res] = validate(data, optional(number()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
