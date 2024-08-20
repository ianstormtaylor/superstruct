import { validate } from "../../../src";
import { expect, test } from "vitest";
import { map, size, number, string } from '../../../src'

test("Invalid size map", () => {
  const data = new Map();
  const [err, res] = validate(data, size(map(number(), string()), 1, 5));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'map',
      refinement: 'size',
      path: [],
      branch: [data],
    },
  ]);
});
