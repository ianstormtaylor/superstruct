import { validate } from "../../../src";
import { expect, test } from "vitest";
import { string, empty } from '../../../src'

test("Invalid empty string", () => {
  const data = 'invalid';
  const [err, res] = validate(data, empty(string()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'string',
      refinement: 'empty',
      path: [],
      branch: [data],
    },
  ]);
});
