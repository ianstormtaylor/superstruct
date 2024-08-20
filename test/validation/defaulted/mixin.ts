import { create } from "../../../src";
import { expect, test } from "vitest";
import { defaulted, string, object, number } from '../../../src'

test("Mixin defaulted", () => {
  const data = {
    version: 0,
  };

  const res = create(data, defaulted(
    object({
      title: string(),
      version: number(),
    }),
    {
      title: 'Untitled',
    }
  ));

  expect(res).toStrictEqual({
    title: 'Untitled',
    version: 0,
  });
});
