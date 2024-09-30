import { create } from '../../../src'
import { expect, test } from 'vitest'
import { defaulted, string, object } from '../../../src'

test('Nested defaulted double', () => {
  const data = {}

  const res = create(
    data,
    object({
      book: defaulted(
        object({
          title: defaulted(string(), 'Untitled'),
        }),
        {}
      ),
    })
  )

  expect(res).toStrictEqual({
    book: {
      title: 'Untitled',
    },
  })
})
