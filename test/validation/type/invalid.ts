import { validate } from "../../../src";
import { expect, test } from "vitest";
import { type, string, number } from '../../../src'

test("Invalid type", () => {
  const data = 'invalid';

  const [err, res] = validate(data, type({
    name: string(),
    age: number(),
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'type',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
