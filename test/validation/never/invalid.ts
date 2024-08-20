import { validate } from "../../../src";
import { expect, test } from "vitest";
import { never } from '../../../src'

test("Invalid never", () => {
  const data = true;
  const [err, res] = validate(data, never());
  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: true,
      type: 'never',
      refinement: undefined,
      path: [],
      branch: [data],
    },
  ]);
});
