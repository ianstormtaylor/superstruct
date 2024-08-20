import { validate } from "../../../src";
import { expect, test } from "vitest";
import { object, array, string } from '../../../src'

test("Invalid object element nested", () => {
  const data = {
    name: 'john',
    emails: ['name@example.com', false],
  };

  const [err, res] = validate(data, object({
    name: string(),
    emails: array(string()),
  }));

  expect(res).toBeUndefined();

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: ['emails', 1],
      branch: [data, data.emails, data.emails[1]],
    },
  ]);
});
