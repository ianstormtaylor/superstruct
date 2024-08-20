import { validate } from "../../../src";
import { expect, test } from "vitest";
import { bigint } from '../../../src'

test("Invalid bigint", () => {
  const data = 'invalid';
  const [err, res] = validate(data, bigint());
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'bigint',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
