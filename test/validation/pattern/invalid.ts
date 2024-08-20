import { validate } from "../../../src";
import { expect, test } from "vitest";
import { string, pattern } from '../../../src'

test("Invalid pattern", () => {
  const data = 'invalid';
  const [err, res] = validate(data, pattern(string(), /\d+/));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'string',
      refinement: 'pattern',
      path: [],
      branch: [data],
    },
  ]);
});
