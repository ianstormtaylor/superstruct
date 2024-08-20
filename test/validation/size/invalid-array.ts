import { validate } from "../../../src";
import { expect, test } from "vitest";
import { array, size, number } from '../../../src'

test("Invalid size array", () => {
  const data = [];
  const [err, res] = validate(data, size(array(number()), 1, 5));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: [],
      type: 'array',
      refinement: 'size',
      path: [],
      branch: [data],
    },
  ]);
});
