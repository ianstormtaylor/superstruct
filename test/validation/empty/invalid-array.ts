import { validate } from "../../../src";
import { expect, test } from "vitest";
import { array, empty, number } from '../../../src'

test("Invalid empty array", () => {
  const data = [1, 2, 3];
  const [err, res] = validate(data, empty(array(number())));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'array',
      refinement: 'empty',
      path: [],
      branch: [data],
    },
  ]);
});
