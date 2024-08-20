import { validate } from "../../../src";
import { expect, test } from "vitest";
import { string, trimmed } from '../../../src'

test("Invalid trimmed", () => {
  const data = false;

  const [err, res] = validate(data, trimmed(string()), {
    coerce: true
  });

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
