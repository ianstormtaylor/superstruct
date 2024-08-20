import { create } from '../../../src'
import { expect, test } from 'vitest'
import { defaulted, string, object } from '../../../src'

test('Nested defaulted', () => {
  const data = {}

  const res = create(
    data,
    object({
      title: defaulted(string(), 'Untitled'),
    })
  )

  expect(res).toStrictEqual({
    title: 'Untitled',
  })
})
