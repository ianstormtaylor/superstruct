import { validate } from "../../../src";
import { expect, test } from "vitest";
import { omit, object, string, number } from '../../../src'

test("Invalid omit", () => {
  const data = 'invalid';

  const [err, res] = validate(data, omit(
    object({
      name: string(),
      age: number(),
    }),
    ['age']
  ));

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
