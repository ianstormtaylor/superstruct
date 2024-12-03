import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { omit, object, array, string } from '../../../src'

test('Invalid omit element nested', () => {
  const data = {
    emails: ['name@example.com', false],
  }

  const [err, res] = validate(
    data,
    omit(
      object({
        name: string(),
        emails: array(string()),
      }),
      ['name']
    )
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: false,
      type: 'string',
      refinement: undefined,
      path: ['emails', 1],
      branch: [data, data.emails, data.emails[1]],
    },
  ])
})
