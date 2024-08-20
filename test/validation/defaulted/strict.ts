import { validate } from '../../../src'
import { expect, test } from 'vitest'
import { defaulted, string, type, number } from '../../../src'

test('Strict defaulted', () => {
  const data = {
    version: 0,
  }

  const [err, res] = validate(
    data,
    defaulted(
      type({
        title: string(),
        version: number(),
      }),
      {
        title: 'Untitled',
      },
      {
        strict: true,
      }
    ),
    {
      coerce: true,
    }
  )

  expect(res).toBeUndefined()

  expect(err).toMatchStructError([
    {
      value: undefined,
      type: 'string',
      refinement: undefined,
      path: ['title'],
      branch: [data, undefined],
    },
  ])
})
