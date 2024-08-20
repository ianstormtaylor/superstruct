import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object } from '../../../src'

test("Invalid object opaque", () => {
  const data = 'invalid';
  const [err, res] = validate(data, object());
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'object',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
