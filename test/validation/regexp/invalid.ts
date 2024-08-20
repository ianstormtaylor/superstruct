import { validate } from "../../../src";
import { expect, test } from "vitest";
import { regexp } from '../../../src'

test("Invalid regexp", () => {
  const data = 'invalid';
  const [err, res] = validate(data, regexp());
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: 'invalid',
      type: 'regexp',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
