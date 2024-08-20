import { validate } from "../../../src";
import { expect, test } from "vitest";
import { number, nullable } from '../../../src'

test("Invalid nullable", () => {
  const data = 'invalid';
  const [err, res] = validate(data, nullable(number()));
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'number',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
