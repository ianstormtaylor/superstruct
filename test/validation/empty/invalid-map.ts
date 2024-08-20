import { validate } from "../../../src";
import { expect, test } from "vitest";
import { map, empty, number, string } from '../../../src'

test("Invalid empty map", () => {
  const data = new Map([[1, 'a']]);
  const [err, res] = validate(data, empty(map(number(), string())));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: data,
      type: 'map',
      refinement: 'empty',
      path: [],
      branch: [data],
    },
  ]);
});
