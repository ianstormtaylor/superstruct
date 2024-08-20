import { validate } from "../../../src";
import { expect, test } from "vitest";
import { type } from '../../../src'

test("Invalid type array", () => {
  const data = [];
  const [err, res] = validate(data, type({}));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: [],
      type: 'type',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
