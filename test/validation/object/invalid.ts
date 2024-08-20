import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object, string, number } from '../../../src'

test("Invalid object", () => {
  const data = 'invalid';

  const [err, res] = validate(data, object({
    name: string(),
    age: number(),
  }));

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
