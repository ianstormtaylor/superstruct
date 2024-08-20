import { validate } from "../../../src";
import { expect, test } from "vitest";
import { literal } from '../../../src'

test("Invalid literal", () => {
  const data = false;
  const [err, res] = validate(data, literal(42));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'literal',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
