import { validate } from "../../../src";
import { expect, test } from "vitest";
import { pick, object, array, string } from '../../../src'

test("Invalid pick element nested", () => {
  const data = {
    emails: ['name@example.com', false],
  };

  const [err, res] = validate(data, pick(
    object({
      name: string(),
      emails: array(string()),
    }),
    ['emails']
  ));

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
