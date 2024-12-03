import { assert } from '../../../src'
import { expect, test } from 'vitest'
import { object, string, pattern, refine } from '../../../src'

const Section = pattern(string(), /^\d+(\.\d+)*$/)

test('Valid object referential', () => {
  const data = {
    section: '1',
    subsection: '1.1',
  }

  assert(
    data,
    object({
      section: Section,
      subsection: refine(Section, 'Subsection', (value, ctx) => {
        const { branch } = ctx
        const parent = branch[0]
        return value.startsWith(`${parent.section}.`)
      }),
    })
  )

  expect(data).toStrictEqual({
    section: '1',
    subsection: '1.1',
  })
})
