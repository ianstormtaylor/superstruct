import { validate } from "../../../src";
import { expect, test } from "vitest";
import { partial, string, number } from '../../../src'

test("Invalid partial property unknown", () => {
  const data = {
    name: 'john',
    unknown: true,
  };

  const [err, res] = validate(data, partial({
    name: string(),
    age: number(),
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: true,
      type: 'never',
      refinement: undefined,
      path: ['unknown'],
      branch: [data, data.unknown],
    },
  ]);
});
