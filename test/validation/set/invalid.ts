import { validate } from "../../../src";
import { expect, test } from "vitest";
import { set, number } from '../../../src'

test("Invalid set", () => {
  const data = 'invalid';
  const [err, res] = validate(data, set(number()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'set',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
